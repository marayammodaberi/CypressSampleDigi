/**
 * ==========================================================================
 *  QA Automation — Cypress E2E Test
 *  هدف تست:
 *   ورود به سایت دیجی‌کالا > دسته‌بندی لپ‌تاپ > اعمال فیلتر محدوده قیمت
 *   (1,000,000 تا 100,000,000 تومان) > مرتب‌سازی براساس «گران‌ترین» >
 *   انتخاب گران‌ترین لپ‌تاپ > افزودن آن به سبد خرید.
 *
 *  نحوه اجرا:
 *   1) پیش‌نیاز: Node.js نصب باشد.
 *   2) نصب Cypress در پروژه:      npm install cypress --save-dev
 *   3) این فایل را در مسیر:       cypress/e2e/digikala_laptop_e2e.cy.js  قرار دهید.
 *   4) اجرای گرافیکی (Test Runner): npx cypress open   -> انتخاب فایل تست
 *      اجرای headless (CI):          npx cypress run --spec "cypress/e2e/digikala_laptop_e2e.cy.js"
 *
 *  نکته مهم درباره Selectorها:
 *   چون دیجی‌کالا یک اپلیکیشن پویا (React/SPA) است و data-testid عمومی و
 *   مستند رسمی برای Selectorهای آن در دسترس نیست، Selectorهای زیر بر اساس
 *   ساختار متداول UI سایت نوشته شده‌اند. پیش از اجرای واقعی روی سایت زنده،
 *   لازم است Selectorها (کامنت‌شده با TODO) با مقادیر واقعی گرفته‌شده از
 *   DevTools مرورگر جایگزین شوند. برای پایدارتر شدن تست در پروژه واقعی،
 *   بهترین روش هماهنگی با تیم فرانت‌اند برای افزودن attribute های
 *   data-cy روی المان‌های کلیدی (دسته‌بندی، فیلتر قیمت، سورت، افزودن به سبد) است.
 * ==========================================================================
 */

describe('دیجی‌کالا - فیلتر، مرتب‌سازی و افزودن گران‌ترین لپ‌تاپ به سبد خرید', () => {
  const MIN_PRICE = '1000000';
  const MAX_PRICE = '100000000';

  beforeEach(() => {
    cy.visit('https://www.digikala.com/');
  });

  it('باید گران‌ترین لپ‌تاپ در بازه قیمتی تعیین‌شده را به سبد خرید اضافه کند', () => {
    // 1) ورود به دسته‌بندی لپ‌تاپ از طریق منوی دسته‌بندی‌ها
    // TODO: در صورت نیاز selector را با مقدار واقعی سایت جایگزین کنید.
    cy.get('[data-cy="header-categories-button"], .c-header__categories-btn')
      .first()
      .click();

    cy.contains('a, li, span', 'لپ‌تاپ', { matchCase: false })
      .first()
      .click();

    // اطمینان از رسیدن به صفحه لیست محصولات لپ‌تاپ
    cy.url().should('include', 'laptop-notebook');
    cy.get('body').should('contain.text', 'لپ‌تاپ');

    // 2) باز کردن فیلترها و اعمال محدوده قیمت
    cy.contains('button, div', 'فیلترها', { matchCase: false })
      .first()
      .click();

    cy.get('input[placeholder*="حداقل" i], input[name="min_price"]')
      .first()
      .clear()
      .type(MIN_PRICE);

    cy.get('input[placeholder*="حداکثر" i], input[name="max_price"]')
      .first()
      .clear()
      .type(MAX_PRICE);

    cy.contains('button', 'اعمال فیلتر', { matchCase: false })
      .click();

    // 3) مرتب‌سازی براساس گران‌ترین
    cy.contains('button, div', 'مرتب‌سازی', { matchCase: false })
      .first()
      .click();

    cy.contains('li, button, span', 'گران‌ترین', { matchCase: false })
      .first()
      .click();

    // 4) استخراج قیمت اولین محصول (گران‌ترین) پیش از کلیک، برای مقایسه بعدی
    cy.get('[data-cy="product-card"], .c-product-box')
      .first()
      .invoke('text')
      .as('firstProductText');

    // 5) کلیک روی گران‌ترین محصول
    cy.get('[data-cy="product-card"], .c-product-box')
      .first()
      .click();

    // 6) افزودن به سبد خرید در صفحه جزئیات محصول
    cy.contains('button', 'افزودن به سبد خرید', { matchCase: false })
      .should('be.visible')
      .click();

    // 7) بررسی نتیجه: پیام موفقیت یا به‌روزرسانی تعداد آیتم‌های سبد خرید
    cy.get('[data-cy="cart-badge"], .c-basket-icon__count')
      .should(($badge) => {
        expect(Number($badge.text().trim())).to.be.greaterThan(0);
      });
  });
});
