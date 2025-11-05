import WaterIntakeCard from './_components/WaterIntakeCard';
import MeditationCard from './_components/MeditationCard';
import DailyStepsCard from './_components/DailyStepsCard';
import SleepQualityCard from './_components/SleepQualityCard';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Health Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your daily wellness activities and stay healthy
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Water Intake Card */}
          <div className="lg:col-span-1">
            <WaterIntakeCard />
          </div>

          {/* Daily Steps Card */}
          <div className="lg:col-span-1">
            <DailyStepsCard />
          </div>

          {/* Sleep Quality Card */}
          <div className="lg:col-span-1">
            <SleepQualityCard />
          </div>

          <div className="lg:col-span-1">
            <MeditationCard />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 min-h-[400px] flex items-center justify-center">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <div className="text-4xl mb-2">🏆</div>
              <p>Achievements</p>
              <p className="text-sm mt-1">Coming Soon</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 min-h-[400px] flex items-center justify-center">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <div className="text-4xl mb-2">📊</div>
              <p>Progress Analytics</p>
              <p className="text-sm mt-1">Coming Soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}