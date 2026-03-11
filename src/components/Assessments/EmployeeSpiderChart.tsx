import ReactApexChart from "react-apexcharts";

const EmployeeSpiderChart = ({ details, size = 44 }: { details: any[], size?: number }) => {
  const series = [{
    name: 'Score',
    data: details.map(d => d.score)
  }];

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'radar',
      toolbar: { show: false },
      sparkline: { enabled: true }
    },
    stroke: {
      width: 2,
      colors: ['#6366f1']
    },
    fill: {
      opacity: 0.2,
      colors: ['#6366f1']
    },
    markers: {
      size: 3,
      colors: ['#6366f1']
    },
    xaxis: {
      categories: details.map(d => d.category_name.substring(0, 5)),
      labels: {
        show: true,
        style: {
          colors: Array(details.length).fill('#94a3b8'),
          fontSize: '10px',
          fontWeight: 600
        }
      }
    },
    yaxis: {
      show: false,
      min: 0,
      max: 5,
      tickAmount: 5
    },
    grid: {
      show: false
    }
  };

  return (
    <div style={{ height: `${size * 4}px` }} className="w-full flex justify-center items-center">
      <ReactApexChart options={options} series={series} type="radar" height="100%" width="100%" />
    </div>
  );
};

export default EmployeeSpiderChart;
