const DateDisplay = ({ dateString }) => {
  const formattedDate = new Date(dateString);

  const month = formattedDate.toLocaleString('en-US', { month: 'long' });
  const year = formattedDate.getFullYear();

  return (
    <div>
      <p>
        {month}, {year}
      </p>
    </div>
  );
};

export default DateDisplay;
