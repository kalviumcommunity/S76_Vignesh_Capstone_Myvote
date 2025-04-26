export default function VoteButton({ onClick }) {
    return (
      <button
        onClick={onClick}
        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
      >
        Vote
      </button>
    );
  }
  