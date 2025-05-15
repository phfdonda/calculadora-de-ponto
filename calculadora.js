function calcularHorarioSaida(horaEntradaStr, intervaloMinutos = 30) {
	// Converte a string de hora para um objeto Date
	const [hora, minuto] = horaEntradaStr.split(":").map(Number)
	const dataBase = new Date(2000, 0, 1, hora, minuto)

	// Definições de jornada em minutos
	const jornadaMin = 6 * 60
	const jornadaMax = 8 * 60

	// Horário de saída mínima (6h + 15min de intervalo)
	const saidaMinima = new Date(dataBase.getTime() + (jornadaMin + 15) * 60000)
	// Horário de saída máxima (8h + intervalo tirado)
	const saidaMaxima = new Date(
		dataBase.getTime() + (jornadaMax + intervaloMinutos) * 60000
	)

	// Formata para HH:MM
	function formatarHora(date) {
		return date.toTimeString().slice(0, 5)
	}

	return [formatarHora(saidaMinima), formatarHora(saidaMaxima)]
}

function calcularIntervalo(horaSaidaIntervalo, horaVoltaIntervalo) {
	const [h1, m1] = horaSaidaIntervalo.split(":").map(Number)
	const [h2, m2] = horaVoltaIntervalo.split(":").map(Number)
	const t1 = h1 * 60 + m1
	const t2 = h2 * 60 + m2
	return Math.max(0, t2 - t1)
}

function calcularSaidaComIntervalo(horaEntradaStr, intervaloRealMin) {
	const [hora, minuto] = horaEntradaStr.split(":").map(Number)
	const dataBase = new Date(2000, 0, 1, hora, minuto)
	const jornadaMax = 8 * 60
	const saidaMaxima = new Date(
		dataBase.getTime() + (jornadaMax + intervaloRealMin) * 60000
	)
	function formatarHora(date) {
		return date.toTimeString().slice(0, 5)
	}
	return formatarHora(saidaMaxima)
}

// --- Script principal para manipular o DOM ---
window.addEventListener("DOMContentLoaded", function () {
	const form = document.getElementById("formPonto")
	const resultado = document.getElementById("resultado")
	const avisoPadrao = document.getElementById("avisoPadrao")

	// Cria dinamicamente o aviso vermelho se não existir
	let avisoIntervaloCurto = document.getElementById("avisoIntervaloCurto")
	if (!avisoIntervaloCurto) {
		avisoIntervaloCurto = document.createElement("div")
		avisoIntervaloCurto.id = "avisoIntervaloCurto"
		avisoIntervaloCurto.className = "aviso-vermelho"
		avisoIntervaloCurto.style.display = "none"
		form.parentNode.insertBefore(avisoIntervaloCurto, resultado)
	}

	// Esconde o aviso padrão inicialmente
	avisoPadrao.style.display = "none"

	form.addEventListener("submit", function (e) {
		e.preventDefault()
		const horaEntrada = document.getElementById("horaEntrada").value
		const saidaIntervalo = document.getElementById("saidaIntervalo").value
		const voltaIntervalo = document.getElementById("voltaIntervalo").value

		avisoIntervaloCurto.style.display = "none"
		avisoIntervaloCurto.textContent = ""
		avisoPadrao.style.display = "none"

		if (!horaEntrada) {
			resultado.textContent = "Preencha o horário de entrada."
			return
		}

		// Se não informou intervalo real, usa padrão 30min para máximo e 15min para mínimo
		if (!saidaIntervalo || !voltaIntervalo) {
			avisoPadrao.innerHTML =
				"Usando <strong>15 minutos</strong> de intervalo para expediente de 6h, e <strong>30 minutos</strong> para expediente estendido."
			avisoPadrao.style.display = "block"
			const [saidaMin, saidaMax] = calcularHorarioSaida(horaEntrada, 30)
			resultado.innerHTML = `
        Saída mínima: <strong>${saidaMin}</strong> <span style="font-size:0.95em;color:#888;">(15min de intervalo)</span><br>
        Saída máxima: <strong>${saidaMax}</strong> <span style="font-size:0.95em;color:#888;">(30min de intervalo)</span>
      `
		} else {
			avisoPadrao.style.display = "none"
			const intervaloReal = calcularIntervalo(
				saidaIntervalo,
				voltaIntervalo
			)

			if (intervaloReal < 30) {
				const [saidaMin] = calcularHorarioSaida(horaEntrada, 15) // Apenas saída mínima
				resultado.innerHTML = `
          Intervalo realizado: <strong>${intervaloReal} minutos</strong><br>
          Saída máxima: <strong>${saidaMin}</strong>
        `
				avisoIntervaloCurto.textContent =
					"Atenção: O intervalo realizado foi menor que 30 minutos. \nNão realize hora extra, pois isso criará uma ocorrência para o gestor."
				avisoIntervaloCurto.style.display = "block"
			} else {
				const saidaMax = calcularSaidaComIntervalo(
					horaEntrada,
					intervaloReal
				)
				resultado.innerHTML = `
          Intervalo realizado: <strong>${intervaloReal} minutos</strong><br>
          Saída máxima: <strong>${saidaMax}</strong>
        `
			}
		}
	})
	F
})
