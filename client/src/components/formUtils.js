import { useState, useCallback } from "react";

export function useDataHandlers(initialState) {
  const [isData, setData] = useState(initialState);

  function handleInputChange(event) {
    const { name, value } = event.target;
    setData({ ...isData, [name]: value })
  }

  function handleFileChange(event) {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setData({ ...isData, avatar: { file, url: reader.result } })
      reader.readAsDataURL(file);
    }
  }

  return { isData, setData, handleInputChange, handleFileChange };
}

export function useErrorHandlers() {
  const [isMajorError, setMajorError] = useState(false);
  const [isMinorError, setMinorError] = useState(false);

  function triggerMajorError() {
    setMajorError(true);
    setTimeout(() => setMajorError(false), 1000);
  }

  function triggerMinorError() {
    setMinorError(true);
    setTimeout(() => setMinorError(false), 1000);
  }

  return { isMajorError, isMinorError, triggerMajorError, triggerMinorError };
}
