var Atual = {
    props: ['weather'],
    template: '\
    <div class="left-align">\
        <h5>Temperatura: {{weather.main.temp}}ºC</h5>\
        <h5>Temperatura Máxima: {{weather.main.temp_max}}ºC</h5>\
        <h5>Temperatura Mínima: {{weather.main.temp_min}}ºC</h5>\
        <h5>Umidade: {{weather.main.humidity}}%</h5>\
    </div>'
};

var Previsao = {
    props: ['forecast'],
    template: '\
    <table class="centered bordered striped">\
        <thead>\
            <tr>\
                <th>Hora</th>\
                <th>Temperatura</th>\
                <th>Temperatura Max</th>\
                <th>Temperatura Min</th>\
                <th>Umidade</th>\
                <th>Condição Climática</th>\
            </tr>\
        </thead>\
        <tbody>\
            <tr v-for="dados, index in forecast">\
                <td>{{ (index * 3) + 3 }}</td>\
                <td>{{ dados.temp }}º</td>\
                <td>{{ dados.temp_max }}º</td>\
                <td>{{ dados.temp_min }}º</td>\
                <td>{{ dados.humidity }}%</td>\
                <td> <img v-bind:src="dados.icon" class="blue-grey darken-2 btn-floating btn-large waves-effect waves-light btn"> </td>\
            </tr>\
        </tbody>\
    </table>',
};

var Main = new Vue({
    el: "#App",
    data: {
        weather: null,
        forecast: null,
        city: '',
        country: 'br',
        IconAtual: '',
    },
    methods: {
        loadWeather: function(event){
            event.preventDefault();
            var Weather = this;

            $.ajax({
                url: "http://api.openweathermap.org/data/2.5/weather",
                method: "GET",
                dataType: "json",
                data: {
                    "APPID": "83e6c06c0cd5f8f33f8691b36e555cac",
                    "units": "metric",
                    "lang": "pt_br",
                    "type": "accurate",
                    "q": this.city + "," + this.country,
                },
                success: function(data) {
                    Weather.weather = data;
                    Weather.IconAtual = "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
                    console.log(Weather.weather);
                },
                error(){
                    console.error(arguments);
                }
            });
        },

        loadWeatherForecast: function(event){
            event.preventDefault();
            var Forecast = this;
            
            var OneDay = [];
            var AllDays = [];

            $.ajax({
                url: "http://api.openweathermap.org/data/2.5/forecast",
                method: "GET",
                dataType: "json",
                data: {
                    "APPID": "83e6c06c0cd5f8f33f8691b36e555cac",
                    "units": "metric",
                    "lang": "pt_br",
                    "type": "accurate",
                    "q": this.city + "," + this.country,
                },
                success: function(data) {
                    Forecast.forecast = PrevisaoList(data);
                    console.log(Forecast.forecast);
                },
                error(){
                    console.error(arguments);
                }
            });

            function PrevisaoList(data){
                var j = 0;
                var x = 8;
                for (var i = 0; i < 5; i++) {
                    for (j; j < x; j++) {
                        if (data.list[j] != undefined){
                            var aux = {
                                temp: data.list[j].main.temp,
                                temp_max: data.list[j].main.temp_max,
                                temp_min: data.list[j].main.temp_min,
                                humidity: data.list[j].main.humidity,
                                icon: "http://openweathermap.org/img/w/" + data.list[j].weather[0].icon + ".png"
                            };
                            OneDay.push(aux);
                        }
                    }
                    AllDays.push(OneDay);
                    OneDay = [];
                    x += 8;
                }
                return AllDays;
            }
        }
    },
    components: {
        'forecast': Previsao,
        'weather': Atual,
    },

    mounted: function() {
        $('.collapsible').collapsible();
    },
    updated: function() {
        $('.collapsible').collapsible();
    }
});