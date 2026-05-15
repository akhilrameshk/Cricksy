import React from 'react';

interface MatchCardProps {
  matchId: string;
  teamA: string;
  teamB: string;
  score?: string;
  date: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  venue?: string;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  matchId,
  teamA,
  teamB,
  score,
  date,
  status,
  venue,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
          status === 'completed' ? 'bg-green-100 text-green-800' :
          status === 'ongoing' ? 'bg-yellow-100 text-yellow-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="text-center flex-1">
          <p className="font-bold text-lg">{teamA}</p>
        </div>
        <div className="mx-4">
          {score ? (
            <p className="text-2xl font-bold text-center">{score}</p>
          ) : (
            <p className="text-gray-400">vs</p>
          )}
        </div>
        <div className="text-center flex-1">
          <p className="font-bold text-lg">{teamB}</p>
        </div>
      </div>

      <div className="text-sm text-gray-600 mb-3">
        <p>{date}</p>
        {venue && <p className="text-xs">{venue}</p>}
      </div>

      <a href={`/matches/${matchId}`} className="text-blue-600 hover:text-blue-800 font-semibold text-sm">
        View Details →
      </a>
    </div>
  );
};
