function runExperienceCheck() {
  chrome.storage.sync.get(["experience"], (result) => {
    const userExperience = result.experience ?? 0;

    const pageText = document.body.innerText.toLowerCase();

    const patterns = [
      /(\d+)\s*\+\s*years?/g,
      /(\d+)\s*(years?|yrs?)/g,
      /(\d+)\s*-\s*(\d+)\s*(years?|yrs?)/g,
      /(\d+)\s*to\s*(\d+)\s*(years?|yrs?)/g,
      /(\d+)\s*-\s*(\d+)\+?\s*(years?|yrs?)/g,
      /minimum\s*(of)?\s*(\d+)\s*(years?|yrs?)/g,
      /at\s*least\s*(\d+)\s*(years?|yrs?)/g,
      /(one|two|three|four|five|six|seven|eight|nine|ten)\s*(years?|yrs?)/g,
      /(\d+)\s*(years?|yrs?)\s*(of)?\s*(experience)/g,
      /experience\s*[:\-]?\s*(\d+)\s*(years?|yrs?)/g,
      /requires?\s*(\d+)\s*(years?|yrs?)/g,
      /requirement[s]?\s*[:\-]?\s*(\d+)\s*(years?|yrs?)/g,
      /(\d+)\s*(years?|yrs?)['’]?\s*(experience)?/g,
      /(\d+)\s*(yrs?)\s*(exp)/g,
      /(\d+)\+?\s*(yrs?)\s*(exp)/g,
      /around\s*(\d+)\s*(years?|yrs?)/g,
      /(approx|approximately)\s*(\d+)\s*(years?|yrs?)/g,
      /up\s*to\s*(\d+)\s*(years?|yrs?)/g,
    ];

    const wordToNumber = {
      one: 1,
      two: 2,
      three: 3,
      four: 4,
      five: 5,
      six: 6,
      seven: 7,
      eight: 8,
      nine: 9,
      ten: 10
    };

    let foundExperiences = [];

    for (let pattern of patterns) {
      let match;
      while ((match = pattern.exec(pageText)) !== null) {
        let num = parseInt(match[1]);

        if (isNaN(num)) {
          const word = match[1];
          if (wordToNumber[word]) {
            num = wordToNumber[word];
          }
        }

        if (!isNaN(num)) {
          foundExperiences.push(num);
        }
      }
    }

    let requiredExp = null;
    if (foundExperiences.length > 0) {
      requiredExp = Math.min(...foundExperiences);
    }

    let status = "Could not detect";
    let color = "gray";

    if (requiredExp !== null) {
      if (userExperience >= requiredExp) {
        status = "Good fit";
        color = "green";
      } else if (userExperience + 0.5 >= requiredExp) {
        status = "Slight stretch";
        color = "orange";
      } else {
        status = "Not a good fit";
        color = "red";
      }
    }

    const box = document.createElement("div");
    box.className = "job-exp-box";
    box.innerHTML = `
      <strong>Experience Check</strong><br/>
      You: ${userExperience} yrs<br/>
      Required: ${requiredExp ?? "Unknown"} yrs<br/>
      Status: <span style="color:${color}">${status}</span>
    `;

    document.body.appendChild(box);
  });
}

setTimeout(runExperienceCheck, 1000);
