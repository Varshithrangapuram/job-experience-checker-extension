const input = document.getElementById("expInput");
const saveBtn = document.getElementById("saveBtn");

// Load saved value
chrome.storage.sync.get(["experience"], (result) => {
  if (result.experience !== undefined) {
    input.value = result.experience;
  }
});

// Save value
saveBtn.addEventListener("click", () => {
  const value = parseFloat(input.value);

  chrome.storage.sync.set({ experience: value }, () => {
    alert("Experience saved!");
  });
});
