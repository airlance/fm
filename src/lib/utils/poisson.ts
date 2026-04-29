const factorial: (n: number) => number = (n) => (n <= 1 ? 1 : n * factorial(n - 1));

// Вероятность конкретного количества голов (x) при среднем (lambda)
export const getPoissonProbability = (x: number, lambda: number) => {
    return (Math.exp(-lambda) * Math.pow(lambda, x)) / factorial(x);
};

// Симуляция количества голов
export const simulateGoals = (lambda: number) => {
    const L = Math.exp(-lambda);
    let p = 1.0;
    let k = 0;

    do {
        k++;
        p *= Math.random();
    } while (p > L);

    return k - 1;
};
