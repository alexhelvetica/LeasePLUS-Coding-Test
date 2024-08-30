// if employerType != Corporate || Hospital || PBI
// if employmentType != Casual || PartTime || FullTime

const CorpSalaryLowerLimit = 100000;
const EmploymentTypes = ["FullTime", "PartTime", "Casual"];
const EmployerTypes = ["Corporate", "Hospital", "PBI"];

function packageSubmission() {
  let e = document.getElementById("employerType");
  let employerType = e.options[e.selectedIndex].value;

  e = document.getElementById("employmentType");
  let employmentType = e.options[e.selectedIndex].value;

  let salary = document.getElementById("salary").value;
  let universityEducated =
    document.getElementById("universityEducated").checked;

  let hoursWorked = document.getElementById("hoursWorked").value;

  let salaryPackage = packageCalculation(
    employerType,
    employmentType,
    salary,
    universityEducated,
    hoursWorked
  );

  document.getElementById(
    "salaryPackageTextBox"
  ).innerText = `Salary Package is $${salaryPackage}`;
}

function packageCalculation(
  employerType,
  employmentType,
  salary,
  universityEducated = false,
  hoursWorked = -1
) {
  let package = 0;

  if (!EmploymentTypes.includes(employmentType)) {
    console.error(
      `Invalid Employment Type - ${employmentType}. Accepted ${EmploymentTypes}.`
    );
    return 0; //`Invalid Employment Type - ${employmentType}. Accepted ${EmploymentTypes}.`;
  }

  if (isNaN(salary)) {
    console.error(`Invalid - Salary is not a Number.`);
    return 0; // `Invalid - Salary is not a Number.`;
  }

  switch (employerType) {
    case "Corporate":
      if (employmentType != "Casual") {
        if (salary > 100000) {
          package += (salary - 100000) * 0.001;
          salary = 100000;
        }
        package += salary * 0.01;

        let packageModifier = 1;

        if (employmentType == "PartTime") {
          if (/*!hoursWorked || */ hoursWorked < 0 || hoursWorked > 38) {
            console.error(
              `Impossible Hours Worked - ${hoursWorked}. Limit 0 - 38`
            );
            return 0; //`Impossible Hours Worked - ${hoursWorked}. Limit 0 - 38`;
          }
          packageModifier = hoursWorked / 38;
        }
        return package * packageModifier;
      }
      break;

    case "Hospital":
      packageDefault = 10000;
      package = packageDefault;
      if (salary * 0.2 > package) {
        package = salary * 0.2;
        if (package > 30000) {
          package = 30000;
        }
      }
      if (universityEducated) {
        package += 5000;
      }
      if (employmentType == "FullTime") {
        package *= 1.095;
        package += salary * 0.012;
      }

      break;
    case "PBI":
      packageDefault = 50000;
      package = packageDefault;

      if (employmentType == "Casual") {
        package = salary * 0.1;
      } else if (salary * 0.3255 < package) {
        package = salary * 0.3255;
      }

      if (universityEducated) {
        package += 2000 + salary * 0.01;
      }

      if (employmentType == "PartTime") {
        package *= 0.8;
      }
      break;
    default:
      console.error(
        `Invalid Employer Type - ${employerType}. Accepted ${EmployerTypes}.`
      );
      return 0; //`Invalid Employer Type - ${employerType}. Accepted ${EmployerTypes}.`;
  }
  return package;
}
