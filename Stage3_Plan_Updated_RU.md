# Этап 3 — Авторизация + закрытые зоны (обновлённый план по фактическому проекту)

Основано на текущей архитектуре проекта:
- NextAuth v4 (Credentials email/password) + PrismaAdapter + Neon Postgres
- Session strategy: JWT
- Token ledger: таблица `Transaction`, баланс считается динамически через `getUserBalance()`
- Publish списывает токены корректно, Preview на бэкенде сейчас НЕ списывает (несоответствие)
- Coach request списывает токены, но запрос НЕ сохраняется в БД (TODO)

---

## PR 3.0 — Стабилизация базовых утилит (маленький PR)
**Цель:** один “источник правды” для user/session/balance, чтобы дальше не плодить паттерны.

### Задачи
- Добавить/проверить утилиты:
  - `lib/auth/session.ts` (getSession/getUserId)
  - `lib/balance.ts` использовать везде как источник
- Единый helper:
  - `requireAuth(returnTo)` → redirect на `/auth/sign-in?returnTo=...`

### DoD
- В проекте есть единый импорт для session/balance.
- Ничего не ломаем, только рефактор helpers.

---

## PR 3.1 — Auth UI страницы + returnTo
**Цель:** нормальные страницы /auth без модалок.

### Роуты
- `/auth/sign-in`
- `/auth/sign-up`
- `/auth/reset-password`

### Задачи
- Sign-in:
  - форма email/password
  - `signIn("credentials", { redirect:false })`
  - редирект на `returnTo` или `/dashboard`
- Sign-up:
  - endpoint `POST /api/auth/register` (если нет)
  - создание User в Prisma + bcrypt hash
  - после успеха: auto sign-in + redirect
- Reset password:
  - минимальная реализация: запрос → письмо через Resend (если уже есть), иначе временно “dev mode”
  - таблица reset tokens (можно отдельной моделью `PasswordResetToken`), либо использовать `VerificationToken`, если удобно

### DoD
- Регистрация/вход/сброс пароля работают, returnTo сохраняется.
- Ошибки показываются inline (без “пропало и всё”).

---

## PR 3.2 — Guards: закрываем /dashboard и /account
**Цель:** гостю туда нельзя.

### Задачи
- Добавить `middleware.ts`:
  - защищаем `/dashboard` и `/account`
  - redirect на `/auth/sign-in?returnTo=...`
- Дополнительно: server guard внутри страниц (как второй замок).

### DoD
- Гость не может открыть `/dashboard`, `/account`.
- Авторизованный может.
- Никаких модалок.

---

## PR 3.3 — /generator: публичная страница, приватные действия
**Цель:** видеть можно всем, тратить токены/генерировать — только authed.

### Задачи
- На клиенте:
  - если `!session` → кнопки Preview/Publish заменяем на `Sign in to generate`
  - переход на `/auth/sign-in?returnTo=/generator`
- Опционально (рекомендую):
  - draft restore: сохранять форму генератора в `localStorage` и восстанавливать после логина

### DoD
- Гость видит форму, но не может выполнить spend action.
- После логина возвращается на /generator и (если включили) видит восстановленную форму.

---

## PR 3.4 — Критический фикс: Preview должен списывать 50 токенов (или станет бесплатным)
**Почему это важно:** сейчас фронт проверяет баланс на preview, но бэкенд НЕ списывает. Это “дырка” в экономике и логике.

### Решение (рекомендую)
- Превью стоит 50 токенов → значит списываем на бэкенде.

### Задачи
- В `app/api/generator/preview/route.ts`:
  - добавить проверку session
  - добавить `Transaction(type="spend", amount=-50, meta: {reason:"preview"})`
  - `Preview.tokensSpent = 50`
- Убедиться, что фронт и бэк используют одну константу PREVIEW_COST.

### DoD
- Любой preview списывает 50 токенов и отражается в истории.
- Недостаточно токенов → 402/400 с понятной ошибкой + UI ведёт на /pricing.

---

## PR 3.5 — Coach Requests: сохраняем в БД (иначе Dashboard “про coach” будет пустой)
**Почему:** сейчас токены списываются, но самого запроса нет в БД.

### Задачи
- Добавить Prisma модель `CoachRequest`:
  - `id, userId, coachSlug/coachId, goal, level, trainingType, equipment, daysPerWeek, notes`
  - `status` (pending/in_progress/delivered/failed/cancelled/refunded)
  - `tokensCharged`, `transactionId`, timestamps
- Обновить `POST /api/coach-requests`:
  - после списания создать запись в БД и вернуть `requestId`
- Добавить `GET /api/coach-requests/list` (для Dashboard)

### DoD
- После запроса у пользователя появляется запись coach request в БД.
- Можно вывести список в Dashboard.
- Нет “списали токены и забыли”.

---

## PR 3.6 — Dashboard /dashboard (реальные данные, без маркетинга)
**Цель:** понятные статусы + история токенов + ссылки на support.

### Источники данных
- Instant AI: таблица `Course` (уже есть)
- Coach requests: `CoachRequest` (из PR 3.5)
- Token history: `Transaction` (уже есть, есть `/api/tokens/history`)

### UI структура
- Summary cards: Balance / Recent activity / Support
- Tabs: Activity / Tokens / Support
- Activity = объединённый фид (Course + CoachRequest)

### DoD
- Авторизованный видит:
  - список AI курсов (Course)
  - список coach requests
  - токен-леджер
- Empty states ведут на /coaches и /generator.

---

## PR 3.7 — Account /account
**Цель:** минимальный кабинет.

### Задачи
- Email read-only
- Change password:
  - endpoint `POST /api/account/change-password`
  - проверка текущего пароля через bcrypt
  - обновление hash в User
- Sign out

### DoD
- Смена пароля работает.
- Выход работает.
- Страница закрыта guard’ом.

---

# Порядок запуска (самый безопасный)
1) PR 3.1 (auth pages)  
2) PR 3.2 (middleware guards)  
3) PR 3.3 (generator gating)  
4) PR 3.4 (preview spend fix)  
5) PR 3.5 (coach requests persistence)  
6) PR 3.6 (dashboard)  
7) PR 3.7 (account)

---

# Риски и ловушки
- Middleware: в edge среде нельзя использовать node-only модули. NextAuth middleware обычно ок, но не тащи bcrypt туда.
- Preview spend: следить, чтобы не было двойного списания при повторном клике (disable button on loading).
- Container: новые страницы делай с тем же контейнером, что Home. Сейчас Container используется не везде — не пытайся “починить всё” в этом этапе.
