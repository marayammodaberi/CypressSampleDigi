

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
