/*
A. Конфигурируемый калькулятор
Вам требуется написать калькулятор который работает на конфигах. Каждый конфиг состоит из двух полей. В одном поле (vars) мы получаем переменные (некоторые из них нам предстоит вычислить). Другое поле (calculations) содержит формулы для расчётов.

Шаблон отправки решения:

module.exports = function solution(config) {
	// Ваше решение...
}
Формат ввода
{
	vars: [
		{
			id: 'a',
			formula: 'calcA'
		},
		{
			id: 'b',
			formula: 'calcB'
		},
		{
			id: 'c',
			formula: 'calcC'
		},
		{
			id: 'd',
			value: 5
		},
		{
			id: 'f',
			value: 5
		},
	],
	calculations: [
		{
			id: 'calcA',
			formula: '$b + $c'
		},
		{
			id: 'calcB',
			formula: '$d * ( $f + 5 )'
		},
		{
			id: 'calcC',
			formula: '$f + $b'
		},
	]
}
	Формат вывода
		{ a: 105, b: 50, c: 55, f: 5, d: 5 }
					
					
Примечания
	не может быть переменной где есть оба поля formula и поле value
	в поле formula содержит идентификатор формулы и это всегда строка, но не гарантируется, что существует формула с таким id
	если посчитать все значения по данному конфигу невозможно, то вместо объекта с результатом требуется вернуть строку "impossible"
	доступные операции +, -, *, / и скобки (, ) любой вложенности
	скобки расставлены всегда правильно
	все сущности формулы разделены пробелом
	важно соблюдать порядок действий
	гарантируется, что если в конфиге есть все необходимые переменные для формулы, то расчёт можно произвести
*/
module.exports = function solution(config) {
	const calculate = (expression, config) => {
		for (const calculation of config.calculations) {
			if (expression === calculation.id) {
				return calculate(calculation.formula, config);
			}
		}
		return expression.replace(/\$(\w+)/g, (match, variable) => {
			for (const varObj of config.vars) {
				if (varObj.id === variable) {
					if (varObj.value !== undefined) {
						return varObj.value;
					} else {
						return calculate(varObj.formula, config);
					}
				}
			}
		});
	};

	const math = (expression) => {
		const arr = expression.split(' ');
		const solve = (arr) => {
			while (arr.includes('*') || arr.includes('/')) {
				let multiply = arr.indexOf('*');
				let divide = arr.indexOf('/');

				if ((multiply < divide && multiply !== -1) || (multiply !== -1 && divide === -1)) {
					const newVar = (+arr[multiply - 1] * (+arr[multiply + 1]));
					arr.splice((multiply - 1), 3, newVar.toString());
				} else {
					const newVar = (+arr[divide - 1] / (+arr[divide + 1]));
					arr.splice((divide - 1), 3, newVar.toString());
				}
			}

			while (arr.includes('+') || arr.includes('-')) {
				let plus = arr.indexOf('+');
				let minus = arr.indexOf('-');

				if ((plus < minus && plus !== -1) || (plus !== -1 && minus === -1)) {
					const newVar = (+arr[plus - 1] + (+arr[plus + 1]));
					arr.splice((plus - 1), 3, newVar.toString());
				} else {
					const newVar = (+arr[minus - 1] - (+arr[minus + 1]));
					arr.splice((minus - 1), 3, newVar.toString());
				}
			}

			return +arr[0];
		};

		while (arr.includes('(')) {
			let startIndex = arr.indexOf('(');
			let endIndex = arr.indexOf(')');
			let result = solve(arr.slice(startIndex + 1, endIndex));
			arr.splice(startIndex, endIndex - startIndex + 1, result);
		}
		const result = solve(arr);
		return Number(result);
	};

	try {
		let result = {};
		for (let variable of config.vars) {
			if (variable.value === undefined) {
				result[variable.id] = math(calculate(variable.formula, config));
			} else {
				result[variable.id] = variable.value;
			}
		}

		return result;
	}
	catch (error) {
		console.error(error);
		return 'impossible';
	}
}