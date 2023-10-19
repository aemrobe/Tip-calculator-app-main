// //###### Elements ######
//input Elements
const inputs = document.querySelectorAll('input[type="number"]');
const inputforthetips = document.querySelector(".input-for-the-tips");
const inputBill = document.querySelector("#bill");
const tipButtons = document.querySelectorAll(".tip-button");
const noOfPeople = document.querySelector("#no-of-people");
const buttonList = document.querySelector(".button-list");
const customInput = document.querySelector(".custom-tip");
const resetButton = document.querySelector(".reset-btn ");

//output element
const outputValue = document.querySelectorAll(".output__value");

const outputTipPerPerson = document.querySelector(".output__value--tip");
const outputTotalPerPerson = document.querySelector(".output__value--total");

//object oriented programming
class tip {
  tipPercentage;

  fields = [
    {
      element: inputBill,
      validator: [this.validateFieldRequired, this.validateZero],
    },
    {
      element: customInput,
      validator: [this.validateSelectTip, this.validateOutOfBound],
    },
    { element: noOfPeople, validator: [this.validateZero] },
  ];

  constructor() {
    this.playing = false;
    //event listeners
    inputBill.addEventListener("keyup", this.eventHanlderInputBill.bind(this));
    inputBill.addEventListener("change", this.eventHanlderInputBill.bind(this));

    //managing buttons
    buttonList.addEventListener("change", this.managingButtons.bind(this));

    //managing custom input
    customInput.addEventListener("focus", this.managingCustomInputs.bind(this));

    customInput.addEventListener(
      "keyup",
      this.eventHandlerCustomInput.bind(this)
    );

    customInput.addEventListener(
      "change",
      this.eventHandlerCustomInput.bind(this)
    );

    //number of people
    noOfPeople.addEventListener(
      "keyup",
      this.eventHandlerNoOfPeople.bind(this)
    );

    noOfPeople.addEventListener(
      "change",
      this.eventHandlerNoOfPeople.bind(this)
    );

    //reset button
    resetButton.addEventListener("click", this.reset.bind(this));

    //window reload
    window.onload = this.clearInputs();
  }

  //## validators ##
  validateZero(value) {
    return +value <= 0 ? `must be greater than zero` : null;
  }

  //validator Select Tip
  validateSelectTip(value) {
    //if the user select the tip from the buttons not using the custom input

    if (customInput.readOnly === true) {
      this.tipPercentage =
        Number.parseInt(
          Array.from(tipButtons).find((button) =>
            button.classList.contains("tip-button--active")
          )?.textContent
        ) / 100;

      if (this.tipPercentage) {
        return null;
      } else {
        return "select a Tip";
      }
    } else {
      this.tipPercentage = +value / 100;

      //if the user write the tip by using the custom Tip input
      return value === "" ? "select a Tip" : null;
    }
  }

  //validate out of bound
  validateOutOfBound(value) {
    if (customInput.readOnly === false) {
      return value <= 0 || value > 100
        ? "The Tip must be between (0 - 100) "
        : null;
    }
  }

  //validate field required
  validateFieldRequired(value) {
    return value === "" ? "fill the bill" : null;
  }

  //## normal Functions ##
  //showErroMessage
  showErrorMessage(field, error) {
    //changing the border color of the InputContainer

    //setting aria invalid state
    field.setAttribute("aria-invalid", "true");

    //changing the outline property of the parent element
    field.parentElement.style.outline = "3px solid var(--red)";

    //the element which show the error
    const showErrorElement = field.parentElement.nextElementSibling;

    //showing the error
    showErrorElement.classList.remove("hidden");

    //setting the aria-live attribute
    showErrorElement.setAttribute("aria-live", "polite");

    outputValue.forEach((output) => {
      output.setAttribute("aria-live", "polite");
    });

    //setting the textContent of the showError element
    showErrorElement.textContent = `${error}`;

    //setting the text content of the output elements to null
    outputTipPerPerson.textContent = `${this.formatCurrency(0)}`;
    outputTotalPerPerson.textContent = `${this.formatCurrency(0)}`;
  }

  //hide error message
  hideErrorMessage(field) {
    //setting aria invalid state
    field.setAttribute("aria-invalid", "false");

    //removing the style attribute
    field.parentElement.removeAttribute("style");

    //the element which show the error
    const showErrorElement = field.parentElement.nextElementSibling;

    //setting the aria-live attribute
    showErrorElement.setAttribute("aria-live", "off");

    outputValue.forEach((output) => {
      output.setAttribute("aria-live", "off");
    });

    showErrorElement.classList.add("hidden");
  }

  //event handlers
  eventHanlderInputBill() {
    const error = this.validateZero(inputBill.value);

    if (error) {
      this.showErrorMessage(inputBill, error);
    } else {
      this.hideErrorMessage(inputBill);
    }

    //calculate the Tip
    if (this.playing === true) {
      this.calculateTheTip();
    }
  }

  eventHandlerCustomInput() {
    const error = this.validateOutOfBound(customInput.value);

    if (error) {
      this.showErrorMessage(customInput, error);
    } else {
      this.hideErrorMessage(customInput);
    }

    //calculate the Tip
    if (this.playing === true) {
      this.calculateTheTip();
    }
  }

  eventHandlerNoOfPeople() {
    //validation for the noofpeople field
    const error = this.validateZero(noOfPeople.value);

    if (error) {
      this.showErrorMessage(noOfPeople, error);
    } else {
      this.hideErrorMessage(noOfPeople);
    }

    this.calculateTheTip();

    this.playing = true;
  }

  //format Currency
  formatCurrency(value) {
    const number = new Intl.NumberFormat(navigator.language, {
      style: "currency",
      currency: "USD",
    }).format(value);

    return number;
  }

  calculateTheTip() {
    let totalError = [];

    for (const field of this.fields) {
      const error = this.validateField(field.validator, field.element.value);

      if (error) {
        this.showErrorMessage(field.element, error);
        totalError.push(error);
      } else {
        this.hideErrorMessage(field.element);
      }
    }

    if (totalError.length === 0) {
      //bill,numberofpeople
      const bill = +inputBill.value;
      const tip = this.tipPercentage * bill;
      const numberOfPeople = +noOfPeople.value;

      //total Amount
      const totalAmount = bill + tip;

      //values to be displayed;
      const tipPerPerson = this.formatCurrency(tip / numberOfPeople);
      const totalPerPerson = this.formatCurrency(totalAmount / numberOfPeople);

      //displaying the output
      outputTipPerPerson.textContent = `${tipPerPerson}`;
      outputTotalPerPerson.textContent = `${totalPerPerson}`;
    }
  }

  //make the inputs empty
  clearInputs = function () {
    inputs.forEach((input) => {
      input.value = "";
    });
  };

  //reset
  reset() {
    location.reload();
    this.clearInputs();
    this.hideErrorMessage();
  }

  //running a set of validator on a fields
  validateField(validators, value) {
    for (const validator of validators) {
      const error = validator.call(this, value);

      if (error) return error;
    }
    return null;
  }

  managingButtons(e) {
    const clickedElement = e.target;

    if (!(clickedElement.type === "radio")) return;

    const targetedLabelElement = document.querySelector(
      `label[for="${clickedElement.id}"]`
    );

    // //removing the active class from the buttons//
    tipButtons.forEach((button) =>
      button.classList.remove("tip-button--active")
    );

    // //adding the active class to the clicked button
    targetedLabelElement.classList.add("tip-button--active");

    //calculate the Tip
    // //making the customInput a readonly because we select the buttons
    customInput.readOnly = true;

    if (this.playing === true) {
      this.calculateTheTip();
    }
  }

  //removing the active class from the buttons when the custom input is focussed
  managingCustomInputs() {
    //making the customInput not a read-only
    customInput.readOnly = false;

    /*removing the active class from the buttons*/
    tipButtons.forEach((button) =>
      button.classList.remove("tip-button--active")
    );
  }
}

//creating an object
const Tip = new tip();
