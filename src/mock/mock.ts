// mock.ts
// 模拟数据放置在此
export const fetchChartDataFromApi = async (chartType: 'credit' | 'consume') => {
    return new Promise(resolve => {
        setTimeout(() => {
            if (chartType === 'credit') {
                resolve({
                    data: [
                        { date: '1月', value: 650 },
                        { date: '2月', value: 670 },
                        { date: '3月', value: 690 },
                        { date: '4月', value: 710 },
                        { date: '5月', value: 740 },
                    ]
                });
            } else {
                resolve({
                    data: [
                        { date: '1月', value: 1200 },
                        { date: '2月', value: 1800 },
                        { date: '3月', value: 1400 },
                        { date: '4月', value: 2000 },
                        { date: '5月', value: 1700 },
                    ]
                });
            }
        }, 800);
    });
};

export const getRecentUsedServices = async () => {
    const allServices = [
        { name: '酒店预定', icon: '🏨' },
        { name: '二手房租赁', icon: '🏠' },
        { name: '优惠购物', icon: '🛍️' },
        { name: '舒心就医', icon: '🩺' },
        { name: '便捷停车', icon: '🅿️' },
        { name: '图书借阅', icon: '📚' },
        { name: '亲社会行为', icon: '🤝' },
    ];

    return new Promise(resolve => {
        setTimeout(() => {
            const shuffled = allServices.sort(() => 0.5 - Math.random());
            resolve(shuffled.slice(0, 3));
        }, 500);
    });
};