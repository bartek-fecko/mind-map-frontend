export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const formatted = date.toLocaleDateString('pl-PL', options);
  return formatted;
};

export const getTimeAgo = (dateString: string) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const getCorrectForm = (value: number, forms: [string, string, string]) => {
    const mod10 = value % 10;
    const mod100 = value % 100;
    if (value === 1) return forms[0];
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1];
    return forms[2];
  };

  if (diffInSeconds < 60) {
    const unit = getCorrectForm(diffInSeconds, ['sekundę', 'sekundy', 'sekund']);
    return `${diffInSeconds} ${unit} temu`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    const unit = getCorrectForm(diffInMinutes, ['minutę', 'minuty', 'minut']);
    return `${diffInMinutes} ${unit} temu`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    const unit = getCorrectForm(diffInHours, ['godzinę', 'godziny', 'godzin']);
    return `${diffInHours} ${unit} temu`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  const unit = getCorrectForm(diffInDays, ['dzień', 'dni', 'dni']);
  return `${diffInDays} ${unit} temu`;
};
