import axios from 'axios';
import notifier from 'node-notifier';

const laravelApiUrl = 'http://127.0.0.1:8002/resource-usage'; // Update with your actual Laravel API URL

export const laravelCpuUse = async () => {
  try {
    const response = await axios.get(laravelApiUrl);
    const { cpu_usage, ram_usage } = response.data;

    notifier.notify({
      title: 'Laravel CPU and RAM Usage',
      message: `CPU Usage: ${cpu_usage} % \nRAM Usage: ${ram_usage} MB`,
      icon: './img/laravel.png',
      sound: true,
      
    });
  } catch (error) {
    console.error('Error fetching resource usage:', error);
  }
};

