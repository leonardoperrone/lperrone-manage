export function toFormData<T>(formValue: T) {
  const formData = new FormData();
  for (const key of Object.keys(formValue)) {
    const value = formValue[key];

    if (Array.isArray(value)) {
      value.map((item) => {
        formData.append(`${key}`, item, item['name']);
      });
    } else {
      formData.append(key, value);
    }
  }

  return formData;
}
