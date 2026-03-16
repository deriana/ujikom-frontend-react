import ReactApexChart from "react-apexcharts";

const EmployeeBarChart = ({ details }: { details: any[] }) => {
  const series = [{
    name: 'Score',
    data: details.map(d => d.score)
  }];

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      sparkline: { enabled: true }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
        columnWidth: '60%',
        distributed: true,
      }
    },
    colors: ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'],
    xaxis: {
      categories: details.map(d => d.category_name.substring(0, 5)),
    },
    yaxis: {
      min: 0,
      max: 5
    },
    tooltip: {
      y: { formatter: (val) => `${val} Points` }
    }
  };

  return (
    <div className="h-32 w-full flex justify-center items-center">
      <ReactApexChart options={options} series={series} type="bar" height="100%" width="100%" />
    </div>
  );
};

export default EmployeeBarChart;