const input = document.querySelector('#inputApp');
const select = document.querySelector('#divisas');
const btnDivisa = document.querySelector('#btnDivisa');
const resultado= document.querySelector('#resultado');
const grafico = document.querySelector('#grafico');

let lista;

btnDivisa.addEventListener("click", async () => {
    const seleccionar = select.value;
    const cantidad = Number(inputApp.value);
    const urlApi = `https://mindicador.cl/api/${seleccionar}`;

    const fechas = await fetchFecha(urlApi);
    if (fechas) {
        manejarFecha(fechas, seleccionar, cantidad);
    } else {
        resultado.innerHTML = "Sin datos para la moneda seleccionada.";
    }
    inputApp.value = "";
});

const fetchFecha = async (url) => {
    try {
        const respuesta = await fetch(url);
        const fechas = await respuesta.json();
        return fechas;
    } catch (error) {
        resultado.innerHTML = `Error al obtener los datos: ${error.mensaje}`;
        console.error("Error al obtener los datos:", error);
        return null;
    }
};

const manejarFecha = (fechas, divisa, cantidad) => {
    const series = fechas.serie;
    if (series && series.length > 0) {
        const lastValue = series[0].valor;
        const convertirCantidad = (cantidad / lastValue).toFixed(2);
        resultado.innerHTML = `El monto de ${cantidad} es: ${convertirCantidad} ${divisa.toUpperCase()}`;

        const historialFecha = obtenerFecha(series);
        actualizarFecha(historialFecha, divisa);
    } else {
        resultado.innerHTML = "Sin datos para la moneda seleccionada.";
    }
};

const obtenerFecha = (series) => series.slice(0, 10).reverse();

const actualizarFecha = (historialFecha, divisa) => {
    const labels = [];
    const values = [];

    historialFecha.forEach(day => {
        labels.push(day.fecha.slice(0, 10));
        values.push(day.valor);
    });

    if (lista) {
        lista.destroy();
    }

    lista = new Chart(grafico, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `Valor histórico del ${divisa.toUpperCase()}`,
                data: values,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    empiezaDeCero: false
                }
            }
        }
    });
};