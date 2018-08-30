<script>
import { Doughnut } from "vue-chartjs";
import randomcolor from "randomcolor";

export default {
  extends: Doughnut,
  props: ["data"],
  computed: {
    keys() {
      let labels = [];
      this.data.forEach(d => {
        labels.push(d.key);
      });
      return labels;
    },
    values() {
      let values = [];
      this.data.forEach(d => {
        values.push(d.value);
      });
      return values;
    }
  },
  mounted() {
    this.renderChart(
      {
        labels: this.keys,
        datasets: [
          {
            backgroundColor: randomcolor({
              luminosity: "bright",
              count: this.data.length,
              hue: "random"
            }),
            data: this.values
          }
        ]
      },
      { responsive: true, maintainAspectRatio: true }
    );
  }
};
</script>
