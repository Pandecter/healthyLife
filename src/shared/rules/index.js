export default {
  commonRules: [ //общие правила валидации сразу для нескольких полей (в меню ввода данных пользователя)
    value => !!value || "Значение не может быть пустым!",
    value => {if (value.startsWith(0)) 
              return false || "Значение не может начинаться с нуля!"
              else 
              return true}
  ], 
  ageHeightRules: [
    value => (value || '').length <= 3 || "Значение не должно превышать 3 цифр!",
    value => { const REG_EXP = /^[0-9]+$/
      return REG_EXP.test(value) || "Значение должно быть положительным числом и не содержать знаков!"
    }
  ],
  weightRules: [
    value => { const REG_EXP = /^\d*\.?\d+$/
      return REG_EXP.test(value) || "Значение должно быть положительным, корректным и, при необходимости, разделяться точкой!"
    }
  ],
  inputCountRules: [ //валидация для поля ввода массы продукта
    value => !!value || "Значение не может быть пустым!",
    value => { const REG_EXP = /^[0-9]+$/
               return REG_EXP.test(value) || "Значение должно быть положительным числом!"
    },
    value => (value || '').length <= 5 || "Значение не должно превышать 5 цифр!",
    value => {if (value.startsWith(0)) 
              return false || "Значение не может начинаться с нуля!"
              else 
              return true}
  ],
  ruleForProductName: [
    value => !!value || "Название продукта не может быть пустым!",
    value => (value || '').length <= 40 || "Название продукта не должно превышать 40 символов!",
  ],
  rulesForCalories: [
    value => !!value || "Значение не может быть пустым!",
    value => {if (value.startsWith(0)) 
      return false || "Значение не может начинаться с нуля!"
      else 
      return true},
    value => !/^-.*/.test(value) || "Значение не должно быть отрицательным!",
    value => { const REG_EXP = /^[0-9]+$/
      return REG_EXP.test(value) || "Значение должно быть положительным числом и не содержать знаков!"
    },
    value => (value || '').length <= 4 || "Значение не должно превышать 4 цифр!",
  ],
  rulesForProductStats: [
    value => !!value || "Значение не может быть пустым!",
    value => {if (value.startsWith(0)) 
      return false || "Значение не может начинаться с нуля!"
      else 
      return true},
    value => !/^-.*/.test(value) || "Значение не должно быть отрицательным!",
    value => /^(\d+|\d+,\d{1})$/.test(value) || "Значение разделяйте запятой, после запятой может быть только 1 символ!",
    value => (value || '').length <= 5 || "Значение не должно превышать 5 символов!",
  ],
}