
const sellerStats = data.sellers.map(seller => ({
    id: seller.id,
    name: `${seller.first_name} ${seller.last_name}`,
    revenue: 0,
    profit: 0,
    sales_count: 0,
    products_sold: {}
   // Заполним начальными данными
}));
console.log(sellerStats)
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
        if(seller) {
            seller.sales_count += 1;
            seller.revenue += record.total_amount;
        }
        // Продавец
        // Увеличить количество продаж 
        // Увеличить общую сумму всех продаж

        // Расчёт прибыли для каждого товара
        record.items.forEach(item => {
            const product = productIndex[item.sku]; // Товар
            // Посчитать себестоимость (cost) товара как product.purchase_price, умноженную на количество товаров из чека
            const cost = product.purchase_price * item.quantity;
            // Посчитать выручку (revenue) с учётом скидки через функцию calculateRevenue
            const revenue = calculateRevenue(item);
            // Посчитать прибыль: выручка минус себестоимость
            const profit = revenue - cost;
            // Увеличить общую накопленную прибыль (profit) у продавца  
            seller.profit += profit;
            // Учёт количества проданных товаров
            if (!seller.products_sold[item.sku]) {
                seller.products_sold[item.sku] = 0;
            }
            // По артикулу товара увеличить его проданное количество у продавца
            seller.products_sold[item.sku] += item.quantity;
        });
});
/**
 * Функция для расчета прибыли
 * @param purchase запись о покупке
 * @param _product карточка товара
 * @returns {number}
 */
function calculateSimpleRevenue(purchase, _product) {
   // @TODO: Расчет прибыли от операции
    const { discount, sale_price, quantity } = purchase;
    //из видеоразбора
    return purchase.sale_price * purchase.quantity * (1 - purchase.discount / 100)

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
    const { profit } = seller;
}
/**
 * Функция для анализа данных продаж
 * @param data
 * @param options
 * @returns {{revenue, top_products, bonus, name, sales_count, profit, seller_id}[]}
 */
function analyzeSalesData(data, options) {
    const { calculateRevenue, calculateBonus } = options;
    // @TODO: Проверка входных данных

    // @TODO: Проверка наличия опций

    // @TODO: Подготовка промежуточных данных для сбора статистики

    // @TODO: Индексация продавцов и товаров для быстрого доступа

    // @TODO: Расчет выручки и прибыли для каждого продавца

    // @TODO: Сортировка продавцов по прибыли

    // @TODO: Назначение премий на основе ранжирования

    // @TODO: Подготовка итоговой коллекции с нужными полями
}
/*[{
    seller_id: "seller_1", // Идентификатор продавца
        name: "Alexey Petrov", // Имя и фамилия продавца
        revenue: 123456, // Общая выручка с учётом скидок
        profit: 12345, // Прибыль от продаж продавца
        sales_count: 20, // Количество продаж
        top_products: [{ // Топ-10 проданных товаров в штуках
        sku: "SKU_001", // Артикул товара
        quantity: 12: // Сколько продано
    }],
        bonus: 1234 // Итоговый бонус в рублях, не процент
}]*/
