chrome.storage.sync.get(["experience"], (result) => {
  const userExperience = result.experience ?? 0;

  const pageText = document.body.innerText.toLowerCase();

  const patterns = [
    /(\d+)\+?\s*years?/,
    /(\d+)\s*-\s*(\d+)\s*years?/,
    /(\d+)\s*to\s*(\d+)\s*years?/
  ];

  let requiredExp = null;

  for (let pattern of patterns) {
    const match = pageText.match(pattern);
    if (match) {
      requiredExp = parseInt(match[1]);
      break;
    }
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
