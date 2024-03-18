export const formatNumber = n => {
   return +n.toFixed(2);
};

export const getDataForMetrics = (records, tableProducts) => {
   return records.reduce(
      (accum, { products, totalMoney, purchasePercentage }) => {
         tableProducts.forEach(product => {
            accum[product] ||= [];
            accum[product].push(products[product].count);
         });
         accum.totalMoney.push(totalMoney);
         accum.purchasePercentage.push(purchasePercentage);
         return accum;
      },
      { totalMoney: [], purchasePercentage: [] }
   );
};

export const createTableHeaders = products => {
   const headers = [];
   products.forEach(product => {
      headers.push(product + '(шт)');
      headers.push(product + '(руб)');
   });
   // FIXME:
   return ['Компания', ...headers, 'Итого(руб)', 'Итого(% от продаж)'];
};

export const transformRecords = (records, prices) => {
   const transformedData = records.reduce((accum, record) => {
      const { company, product, count } = record;

      const reducedRecord = accum.find(record => record.company === company);
      const money = formatNumber(count * prices[product]);
      if (reducedRecord) {
         const productData = reducedRecord.products[product] || { count: 0, money: 0 };
         productData.count += count;
         productData.money = formatNumber(productData.money + money);
         reducedRecord.products[product] = productData;
      } else {
         accum.push({
            company,
            products: {
               [product]: { count, money }
            }
         });
      }
      return accum;
   }, []);
   return transformedData;
};

export const fillAggregatedData = records => {
   const recordWithTotalMoney = records.map(record => {
      const total = Object.values(record.products).reduce((sum, { money }) => {
         return sum + money;
      }, 0);
      record.totalMoney = formatNumber(total);
      return record;
   });
   const purchasesSum = recordWithTotalMoney.reduce((sum, record) => {
      return sum + record.totalMoney;
   }, 0);
   return recordWithTotalMoney.map(record => {
      record.purchasePercentage = formatNumber((record.totalMoney / purchasesSum) * 100);
      return record;
   });
};

export const median = array => {
   if (!array.length) {
      return 0;
   }
   if (array.length === 1) {
      return array[0];
   }
   array = [...array].sort((a, b) => a - b);
   const half = Math.floor(array.length / 2);
   return array.length % 2 ? array[half] : (array[half - 1] + array[half]) / 2;
};
