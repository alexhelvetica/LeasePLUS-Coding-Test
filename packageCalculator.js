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
      //Corp Casuals Don't get a package
      if (employmentType != "Casual") {
        // Salaries > 100,000, the 1st 100,000 is 1%, the rest is 0.1%
        if (salary > 100000) {
          package += (salary - 100000) * 0.001;
          salary = 100000;
        }
        package += salary * 0.01;

        let packageModifier = 1;

        //Part Time Staff's Packages are based on their hours compared with fulltime.
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
      //Default Package is $10,000.
      packageDefault = 10000;
      package = packageDefault;

      //If 20% Salary is more than the default, the package is now 20% Salary
      if (salary * 0.2 > package) {
        package = salary * 0.2;
        if (package > 30000) {
          package = 30000;
        }
      }
      //If they are univeristy educated, they get an extra $5,000
      if (universityEducated) {
        package += 5000;
      }

      //If they are a fulltime staff, their package is increased by 9.5%, 
      //and they have an extra 1.2% of their salary
      if (employmentType == "FullTime") {
        package *= 1.095;
        package += salary * 0.012;
      }

      break;
    case "PBI":
      //base package upper limit is $50k.
      packageDefault = 50000;
      package = packageDefault;

      //Casual staff only get paid 10% of their salary as base package.
      if (employmentType == "Casual") {
        package = salary * 0.1;
      }
      //Everyone else, 32.55% of Salary, with the $50k limit. 
      else if (salary * 0.3255 < package) {
        package = salary * 0.3255;
      }

      // $2000 + 1% Salary Bonus if they have a bachelor's degree or higher.
      if (universityEducated) {
        package += 2000 + salary * 0.01;
      }

      //Part Time staff get paid only 80% of their calculated package.
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
