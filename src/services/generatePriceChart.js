


import { ChartJSNodeCanvas } from "chartjs-node-canvas";

export const createChart = async (priceHistory) => {
  // Generate x-axis labels as the index of each data point converted to string
  const labels = priceHistory.map((data) =>
    new Date(data.timestamp * 1000).toLocaleTimeString("en-us", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      day: "2-digit",
      month: "short",
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    })
  );
  const prices = priceHistory.map((data) => data.price);

  const chartJSNodeCanvas = new ChartJSNodeCanvas({
    width: 800,
    height: 400,
  });

  const configuration= {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Price in USD",
          data: prices,
          borderColor: "rgba(75, 192, 192, 1)",
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: "Data Points",
          },
        },
        y: {
          title: {
            display: true,
            text: "Price in USD",
          },
          position: "right", // Position the y-axis on the left
        },
      },
      plugins: {
        legend: {
          display: true,
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem) => {
              const price = tooltipItem.raw ;
              return `$${price.toFixed(2)}`; // Display price in tooltip
            },
          },
        },
      },
    },
  };

  return await chartJSNodeCanvas.renderToBuffer(configuration);
};
