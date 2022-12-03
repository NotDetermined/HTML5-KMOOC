/* A konstruktor ker egy elozo es aktualis szamot, hogy meghatarozza, hova helyezze a
megjelenitendo szoveget a szamologepnek. Letrehozas utan visszaallitom a bemeneteket*/
class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement
    this.currentOperandTextElement = currentOperandTextElement
    this.clear()
  }

/*Torol minden megjelenitett erteket. Ures string lesz az elozo es aktuali szam, muvelet
meghatarozatlan*/
  clear() {
    this.currentOperand = ''
    this.previousOperand = ''
    this.operation = undefined
  }

/*Egyetlen szamot(szamjegyet) torol az aktualis szambol*/
  delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1)
  }
/*Szamok felfuzese az aktualis szamhoz, a .-on kivul minden mast tobbszor hozza lehet fuzni*/
  appendNumber(number) {
    if (number === '.' && this.currentOperand.includes('.')) return
    this.currentOperand = this.currentOperand.toString() + number.toString()
  }

/*Egy muvelet megnyomasakor meghivja a szamolo metodust, ha az elozo szam es mostani sem ures
ekkor az aktualis szam lesz az elozo szam, az aktualis pedig ures lesz. Ha nincs aktualis szam
akkor nem hiv semmit*/
  chooseOperation(operation) {
    if (this.currentOperand === '') return
    if (this.previousOperand !== '') {
      this.compute()
    }
    this.operation = operation
    this.previousOperand = this.currentOperand
    this.currentOperand = ''
  }

/*3 uj vaaltozo:1.eredmenyt tarolja, 2.elozo szamot tarolja szamkent, 3. ue.aktualis szammal
ha utobbi 2-bol barmelyik ures akkor nem fut tovabb, ellenkezo esetben a bevitt muveletnek
megfeleloen frissiti az eredmenyt ami majd az aktualis szam lesz, mig a muveletet es
elozo szamot alapertelmezettre allitja*/
  compute() {
    let computation
    const prev = parseFloat(this.previousOperand)
    const current = parseFloat(this.currentOperand)
    if (isNaN(prev) || isNaN(current)) return
    switch (this.operation) {
      case '+':
        computation = prev + current
        break
      case '-':
        computation = prev - current
        break
      case '*':
        computation = prev * current
        break
      case '÷':
        computation = prev / current
        break
      default:
        return
    }
    this.currentOperand = computation
    this.operation = undefined
    this.previousOperand = ''
  }

/* A szamok megfelelo formazasaert float kaszt kell, hogy a 0.001 is megfeleloen jelenjen
meg a szamot ketteszedem az egesz es tizedesvesszo utani reszre. A maximumfractiondigits
a szuksegtelen tizedesjegyeket levagja a szambol, majd visszater a szammal*/
  getDisplayNumber(number) {
    const stringNumber = number.toString()
    const integerDigits = parseFloat(stringNumber.split('.')[0])
    const decimalDigits = stringNumber.split('.')[1]
    let integerDisplay
    if (isNaN(integerDigits)) {
      integerDisplay = ''
    } else {
      integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 })
    }
    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`
    } else {
      return integerDisplay
    }
  }

/*Ha a muvelet nem null akkor az elozo szam utan a muveletet is kiirja getdisplaynumber
fuggveny alapjan. Az aktualis szam a getdisplaynumber metoduson atesik*/
  updateDisplay() {
    this.currentOperandTextElement.innerText =
      this.getDisplayNumber(this.currentOperand)
    if (this.operation != null) {
      this.previousOperandTextElement.innerText =
        `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
    } else {
      this.previousOperandTextElement.innerText = ''
    }
  }
}

/* reprezentalok minden gombot a gepen es lekerdezessel megkapom az adott stringnek 
megfelelo eleme(ke)t */
const numberButtons = document.querySelectorAll('[data-number]')
const operationButtons = document.querySelectorAll('[data-operation]')
const equalsButton = document.querySelector('[data-equals]')
const deleteButton = document.querySelector('[data-delete]')
const allClearButton = document.querySelector('[data-all-clear]')
const previousOperandTextElement = document.querySelector('[data-previous-operand]')
const currentOperandTextElement = document.querySelector('[data-current-operand]')

/*A szamologep objektum letrehozasa*/
const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)

/*A kulonbozo eventek a megfelelo gombok lenyomasa eseten mas mas metodust hivnak meg*/
numberButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.appendNumber(button.innerText)
    calculator.updateDisplay()
  })
})

operationButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.chooseOperation(button.innerText)
    calculator.updateDisplay()
  })
})

equalsButton.addEventListener('click', button => {
  calculator.compute()
  calculator.updateDisplay()
})

allClearButton.addEventListener('click', button => {
  calculator.clear()
  calculator.updateDisplay()
})

deleteButton.addEventListener('click', button => {
  calculator.delete()
  calculator.updateDisplay()
})