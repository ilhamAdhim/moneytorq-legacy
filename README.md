# MoneytorQ

MoneytorQ is an open-source personal budgeting finance app with MIT license. Built with Next JS + Shadcn UI + Supabase. Currently, MoneytorQ only supports IDR (Indonesian Rupiahs) for the currency.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Contacts](#contacts)
- [Screenshots](#screenshots)

## Features

- User authentication (Access the dashboard with OAuth Logins)
- Overview on how you spent in the last 30 days
- Make your budgeting expenses and income (add, update, delete, view categories)
- Keep track of your expenses and allocate it into your budgets
- Responsive design using Shadcn UI.

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/ilhamadhim/moneytorq
   cd moneytorq
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:

   ```env
   # The base URL of the API
    NEXT_PUBLIC_SUPABASE_URL=
    NEXT_PUBLIC_SUPABASE_ANON_KEY=
   ```

4. Start the development server:
   ```sh
   npm run dev
   ```

## Screenshots

### Dashboard View

![Dashboard View](https://github.com/ilhamAdhim/moneytorq/blob/master/public/assets/dashboard-page.png?raw=true)

In Dashboard view, you can see overall finance health. The latest and highest expenses, your recent income, how is your savings to expenses ratio, etc.

In the side AreaChart, you can also see whether your expenses surpass your income or not. And how stagnant your income is. (Let's try to change that by making new stream of income :D).

<br />

### Budgeting View

![Budgeting View](https://github.com/ilhamAdhim/moneytorq/blob/master/public/assets/category-page.png?raw=true)

In Budgeting view, you can input your budget allocations for expenses. We supports input it by percentage. In further update, you will also be able to input it by the fixed amount.

<br />

### Budgeting View - Income Stream

![Budgeting View - Income](https://github.com/ilhamAdhim/moneytorq/blob/master/public/assets/income-category-page.png?raw=true)

In this view, you can create a new stream of income (Basically creating a new category with `income` type).

For Manage Income, it's almost the same as creating a transaction with `income` type. You can also input it in Transaction view (See next screenshot).
<br />

### Transaction View

![Transaction View](https://github.com/ilhamAdhim/moneytorq/blob/master/public/assets/transaction-page.png?raw=true)

Here lies the details of your transactions from all the way to January - December. Expenses or Incomes, all of it will be shown here. You can filter it by month, year, transaction title, expense type, and categories.

The radar chart in the left will show your top 6 categories sorted by the most expenses amount.

<br />

🚧🚧🚧

## Contacts

If you have any questions or feedback, feel free to reach out at ilham.adhim@gmail.com :)

### Also Written on

- [Medium](https://medium.com/@ilhamm179/from-curiosity-to-code-building-with-supabase-shadcn-d5b0dc7a5d35)
- My Personal Website 🚧
