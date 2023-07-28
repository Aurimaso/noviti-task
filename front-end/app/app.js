const myForm = document.querySelector("form");
const value = document.querySelector("#value");
const input = document.querySelector("#loanAmount");
const yearlyInterest = 0.127;
const numberOfPeriods = 6;

let cycleNumber = 0;
let totalDictionaryOfPayments = {
  principalPartHTML: 0,
  interestHTML: 0,
  totalPaymentHTML: 0,
};
let loanAmount = 0;
let remainingAmount = 0;

value.textContent = input.value;
input.addEventListener("input", (event) => {
  value.textContent = event.target.value;
});

myForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const input = event.target.elements.loanAmount.value;
  totalDictionaryOfPayments = {
    principalPartHTML: 0,
    interestHTML: 0,
    totalPaymentHTML: 0,
  };

  loanAmount = input;
  remainingAmount = input;

  setItemsFromArrayToHTMLTable();

  let row = tableBody.insertRow();
  row.className = "table-row";

  let numberHTML = row.insertCell(0);
  numberHTML.className = "table-data";
  numberHTML.innerHTML = "Total:";

  let remainingAmountHTML = row.insertCell(1);
  remainingAmountHTML.className = "table-data";
  remainingAmountHTML.innerHTML = "0";

  let principalPartHTML = row.insertCell(2);
  principalPartHTML.className = "table-data";
  principalPartHTML.innerHTML =
    totalDictionaryOfPayments.principalPartHTML.toFixed(2) + " EUR";

  let interestHTML = row.insertCell(3);
  interestHTML.className = "table-data";
  interestHTML.innerHTML =
    totalDictionaryOfPayments.interestHTML.toFixed(2) + " EUR";

  let totalPaymentHTML = row.insertCell(4);
  totalPaymentHTML.className = "table-data";
  totalPaymentHTML.innerHTML =
    totalDictionaryOfPayments.totalPaymentHTML.toFixed(2) + " EUR";
});

function paymentPerMonth(
  interestRate,
  numberOfPeriods,
  presentValue,
  futureValue,
  type
) {
  //  type - when the payments are due:
  //          0: end of the period, e.g. end of month (default)
  //         1: beginning of period

  let payment, pvif;

  futureValue || (futureValue = 0);
  type || (type = 0);

  if (interestRate === 0)
    return -(presentValue + futureValue) / numberOfPeriods;

  pvif = Math.pow(1 + interestRate, numberOfPeriods);
  payment = (interestRate * (presentValue * pvif + futureValue)) / (pvif - 1);

  if (type === 1) payment /= 1 + interestRate;

  return payment;
}

function loadTableData(items) {
  let tableBody = document.getElementById("tableBody");
  items.forEach((item) => {
    let row = tableBody.insertRow();
    row.className = "table-row";

    let numberHTML = row.insertCell(0);
    numberHTML.className = "table-data";
    numberHTML.innerHTML = item.numberHTML;

    let remainingAmountHTML = row.insertCell(1);
    remainingAmountHTML.className = "table-data";
    remainingAmountHTML.innerHTML = item.remainingAmountHTML;

    let principalPartHTML = row.insertCell(2);
    principalPartHTML.className = "table-data";
    principalPartHTML.innerHTML = item.principalPartHTML;

    let interestHTML = row.insertCell(3);
    interestHTML.className = "table-data";
    interestHTML.innerHTML = item.interestHTML;

    let totalPaymentHTML = row.insertCell(4);
    totalPaymentHTML.className = "table-data";
    totalPaymentHTML.innerHTML = item.totalPaymentHTML;
  });
}

function createPaymentCycle(loanAmountTest) {
  totalPayment = paymentPerMonth(
    yearlyInterest / 12,
    numberOfPeriods,
    loanAmount
  ).toFixed(2);
  interest = ((remainingAmount * yearlyInterest) / 12).toFixed(2);
  principalPart = (totalPayment - interest).toFixed(2);
  remainingAmount = (loanAmountTest - principalPart).toFixed(2);
  cycleNumber++;

  if (cycleNumber === numberOfPeriods) {
    principalPart = (
      parseFloat(principalPart) + parseFloat(remainingAmount)
    ).toFixed(2);
    totalPayment = (
      parseFloat(totalPayment) + parseFloat(remainingAmount)
    ).toFixed(2);
    remainingAmount = 0;
  }
  totalDictionaryOfPayments.principalPartHTML =
    totalDictionaryOfPayments.principalPartHTML + parseFloat(principalPart);
  totalDictionaryOfPayments.interestHTML += parseFloat(interest);
  totalDictionaryOfPayments.totalPaymentHTML += parseFloat(totalPayment);

  return [
    {
      numberHTML: cycleNumber,
      remainingAmountHTML: remainingAmount,
      principalPartHTML: principalPart,
      interestHTML: interest,
      totalPaymentHTML: totalPayment,
    },
  ];
}

function setItemsFromArrayToHTMLTable() {
  let i = 0;

  let arrayOfPayments = [];

  for (let i = 0; i < numberOfPeriods; i++) {
    arrayOfPayments.push(createPaymentCycle(remainingAmount));
  }
  let tableBody = document.getElementById("tableBody");
  tableBody.remove();
  cycleNumber = 0;
  let tableElement = document.getElementById("myTable");
  let newTableBody = document.createElement("tbody");
  newTableBody.id = "tableBody";
  tableElement.appendChild(newTableBody);

  while (i < arrayOfPayments.length) {
    loadTableData(arrayOfPayments[i]);
    i++;
  }
}
