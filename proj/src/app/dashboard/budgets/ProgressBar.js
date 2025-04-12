export default function ProgressBar({ value, max, remaining }) {
    // Calculate the percentage of the budget spent
    const percentageSpent = (value && max) ? (value / max) * 100 : 100; // Ensure percentage is 100 if value or max is not provided
  
    // Set the bar color to green initially and keep it green
    let barColor = 'bg-green-500'; // Default green color for starting
  
    return (
      <div className="w-full h-2 bg-gray-600 rounded-full overflow-hidden">
        <div
          className={`${barColor} h-full`}
          style={{ width: `${percentageSpent}%` }}
        ></div>
      </div>
    );
  }
  