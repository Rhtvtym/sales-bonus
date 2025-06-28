/**
 * Функция для расчета прибыли
 * @param purchase запись о покупке
 * @param _product карточка товара
 * @returns {number}
 */
function calculateSimpleRevenue(purchase, _product) {
    // @TODO: Расчет прибыли от операции
    //const { discount, sale_price, quantity } = purchase;
    const discount = 1 - (purchase.discount / 100);
    return purchase.sale_price * purchase.quantity * discount
}

/**
 * Функция для расчета бонусов
 * @param index порядковый номер в отсортированном массиве
 * @param total общее число продавцов
 * @param seller карточка продавца
 * @returns {number}
 */
function calculateBonusByProfit(index, total, seller) {
    // @TODO: Расчет бонуса от позиции в рейтинге
    index += 1 // Для удобства (оригинальные индексы начинаются с 0)
    if (index === 1) {
        return 0.15 * seller.profit;
    } else if (index === 2 || index === 3) {
        return 0.10 * seller.profit;
    } else if (index === total) {
        return 0;
    } else { // Для всех остальных
        return 0.05 * seller.profit;
    } 
}
/**
 * Функция для анализа данных продаж
 * @param data
 * @param options
 * @returns {{revenue, top_products, bonus, name, sales_count, profit, seller_id}[]}
 */
function analyzeSalesData(data, options) {
        // @TODO: Проверка входных данных
    if (!data
        || !Array.isArray(data.customers)
        || !Array.isArray(data.products)
        || !Array.isArray(data.sellers)
        || !Array.isArray(data.purchase_records)
        || data.customers.length === 0
        || data.products.length === 0
        || data.sellers.length === 0
        || data.purchase_records.length === 0
    ) {
        throw new Error('Некорректные входные данные');
    } 

    if (typeof options !== "object") {
        throw new Error('Некорректные входные данные');
    }
    const { calculateRevenue, calculateBonus } = options;
    if (!calculateRevenue
        || !calculateBonus
        || typeof calculateRevenue !== "function"
        || typeof calculateBonus !== "function"
    ) {
        throw new Error('Некорректные входные данные');
    }

    const sellerStats = data.sellers.map(seller => ({
        id: seller.id,
        name: `${seller.first_name} ${seller.last_name}`,
        revenue: 0,
        profit: 0,
        sales_count: 0,
        products_sold: {}
        // Заполним начальными данными
    }));

    const sellerIndex = sellerStats.reduce((result, item) => ({
        ...result,
        [item.id]: item
    }), {});

    const productIndex = data.products.reduce((result, item) => ({
        ...result,
        [item.sku]: item
    }), {});

    data.purchase_records.forEach(record => { // Чек 
        const seller = sellerIndex[record.seller_id];
            seller.sales_count += 1;
            seller.revenue += record.total_amount;
        // Продавец
        // Увеличить количество продаж 
        // Увеличить общую сумму всех продаж

        // Расчёт прибыли для каждого товара
        record.items.forEach(item => {
            const product = productIndex[item.sku]; // Товар
            // Посчитать себестоимость (cost) товара как product.purchase_price, умноженную на количество товаров из чека
            const cost = product.purchase_price * item.quantity;
            // Посчитать выручку (revenue) с учётом скидки через функцию calculateRevenue
            const revenue = calculateRevenue(item, product);
            // Посчитать прибыль: выручка минус себестоимость
            const profit = revenue - cost;
            // Увеличить общую накопленную прибыль (profit) у продавца  
            seller.profit += profit;
            // Учёт количества проданных товаров
            if (!seller.products_sold[item.sku]) {
                seller.products_sold[item.sku] = 0;
            }
            // По артикулу товара увеличить его проданное количество у продавца
            seller.products_sold[item.sku] += item.quantity
        });
    });
        sellerStats.sort((a, b) => b.profit - a.profit);
        sellerStats.forEach((seller, index) => {
            seller.bonus = calculateBonusByProfit(index, sellerStats.length, seller);
            seller.top_products = Object.entries(seller.products_sold)
            .map(([sku, quantity]) => ({sku,quantity}))
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 10)
        });
        return sellerStats.map(seller => ({
            seller_id: seller.id,
            name: seller.name,
            revenue: +seller.revenue.toFixed(2),
            profit: +seller.profit.toFixed(2),
            sales_count: seller.sales_count,
            top_products: seller.top_products,
            bonus: +seller.bonus.toFixed(2)
        }));

    // @TODO: Проверка входных данных

    // @TODO: Проверка наличия опций

    // @TODO: Подготовка промежуточных данных для сбора статистики

    // @TODO: Индексация продавцов и товаров для быстрого доступа

    // @TODO: Расчет выручки и прибыли для каждого продавца

    // @TODO: Сортировка продавцов по прибыли

    // @TODO: Назначение премий на основе ранжирования

    // @TODO: Подготовка итоговой коллекции с нужными полями
} // This is just a sample script. Paste your real code (javascript or HTML) here.
