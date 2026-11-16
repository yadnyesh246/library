export const requestConfirmation = (message) =>
  new Promise((resolve) => {
    window.dispatchEvent(
      new CustomEvent("library:confirm", {
        detail: { message, resolve },
      })
    );
  });
