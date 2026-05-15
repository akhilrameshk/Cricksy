export default function ScorecardPage() {
  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Scorecard</h1>

      <div className="bg-gray-800 p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-4">Falcons vs Titans</h2>

        <table className="w-full text-left">
          <thead>
            <tr>
              <th>Player</th>
              <th>Runs</th>
              <th>Balls</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>A. Mehta</td>
              <td>72</td>
              <td>43</td>
              <td>Batting</td>
            </tr>
            <tr>
              <td>R. Singh</td>
              <td>31</td>
              <td>19</td>
              <td>Out</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}