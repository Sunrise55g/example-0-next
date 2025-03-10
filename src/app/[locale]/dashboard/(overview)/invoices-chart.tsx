import { CalendarIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/components/fonts';
import { auth } from '@/auth';

import { ticketsInvoicesService } from '@/services/tickets.invoices.service';




export default async function InvoicesChart() {

  const session:any = await auth();
  const token = session?.user?.jwt

  const dates = await ticketsInvoicesService.statsByDaysCore(token);
  console.log('dates:', dates)

  
  const chartHeight = 350;
 
  const { yAxisLabels, topLabel } = generateYAxis(dates);

  if (!dates || dates.length === 0) {
    return <p className="mt-4 text-gray-400">No data available.</p>;
  }

  return (
    <div className="w-full md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Recent Invoices
      </h2>
     
      <div className="rounded-xl bg-gray-50 p-4">
        <div className="sm:grid-cols-13 mt-0 grid grid-cols-12 items-end gap-2 rounded-md bg-white p-4 md:gap-4">
          <div
            className="mb-6 hidden flex-col justify-between text-sm text-gray-400 sm:flex"
            style={{ height: `${chartHeight}px` }}
          >
            {yAxisLabels.map((label) => (
              <p key={label}>{label}</p>
            ))}
          </div>

          {dates.map((date:any) => (
            <div key={date.date} className="flex flex-col items-center gap-2">
              <div
                className="w-full rounded-md bg-blue-300"
                style={{
                  height: `${(chartHeight / topLabel) * date.count}px`,
                }}
              ></div>
              <p className="-rotate-90 text-xs text-gray-400">
                {date.name}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Last 10 days</h3>
        </div>
      </div>
    </div>
  );
}



export const generateYAxis = (data: any) => {
  // Calculate what labels we need to display on the y-axis
  // based on highest record and in 1000s
  const yAxisLabels = [];
  const highestRecord = Math.max(...data.map((date:any) => date.count));
  const topLabel = Math.ceil(highestRecord);
  
  for (let i = topLabel; i >= 0; i -= 1) {
    yAxisLabels.push(`${i}`);
  }

  return { yAxisLabels, topLabel };
};