import type {
  CartaMemotest,
  ConfiguracionJuego,
  Nivel,
  TipoJuego,
} from '../types/juegos';

// ─────────────────────────────────────────────────────────────────────────────
// Niveles locales — fuente principal de contenido (el backend tiene menos
// niveles seedeados; useNiveles elige la fuente con más niveles).
// ─────────────────────────────────────────────────────────────────────────────

const PREFIJOS: Record<TipoJuego, string> = {
  cazador_silabas: 'cs',
  palabras_gemelas: 'pg',
  intruso_rimas: 'ir',
  conductor_texto: 'ct',
  memotest: 'mt',
  carrera_lectura: 'cl',
};

function nivel(
  tipoJuego: TipoJuego,
  numeroNivel: number,
  titulo: string,
  configuracion: ConfiguracionJuego,
  tiempoLimiteSegundos?: number,
): Nivel {
  return {
    id: `local-${PREFIJOS[tipoJuego]}-${numeroNivel}`,
    tipoJuego,
    numeroNivel,
    titulo,
    dificultad: Math.min(5, Math.ceil(numeroNivel / 3)) as Nivel['dificultad'],
    puntosRecompensa: 20 + numeroNivel * 10,
    ...(tiempoLimiteSegundos ? { tiempoLimiteSegundos } : {}),
    configuracion,
  };
}

// ── Cazador de Sílabas ────────────────────────────────────────────────────────
type DatoCazador = [titulo: string, palabras: Array<[string, string[]]>];

const CAZADOR: DatoCazador[] = [
  ['Primeras sílabas', [['gato', ['ga', 'to']], ['luna', ['lu', 'na']], ['silla', ['si', 'lla']]]],
  ['Dos sílabas', [['mesa', ['me', 'sa']], ['pato', ['pa', 'to']], ['casa', ['ca', 'sa']]]],
  ['Sigue cazando', [['nube', ['nu', 'be']], ['taza', ['ta', 'za']], ['mano', ['ma', 'no']]]],
  ['Tres sílabas', [['pelota', ['pe', 'lo', 'ta']], ['camino', ['ca', 'mi', 'no']], ['zapato', ['za', 'pa', 'to']]]],
  ['Más palabras', [['manzana', ['man', 'za', 'na']], ['conejo', ['co', 'ne', 'jo']], ['ventana', ['ven', 'ta', 'na']]]],
  ['Cazadora veloz', [['tomate', ['to', 'ma', 'te']], ['paloma', ['pa', 'lo', 'ma']], ['helado', ['he', 'la', 'do']]]],
  ['Sílabas trabadas', [['plátano', ['plá', 'ta', 'no']], ['estrella', ['es', 'tre', 'lla']], ['brújula', ['brú', 'ju', 'la']]]],
  ['Cuatro sílabas', [['mariposa', ['ma', 'ri', 'po', 'sa']], ['caballito', ['ca', 'ba', 'lli', 'to']], ['dinosaurio', ['di', 'no', 'sau', 'rio']]]],
  ['Palabras ricas', [['chocolate', ['cho', 'co', 'la', 'te']], ['elefante', ['e', 'le', 'fan', 'te']], ['bicicleta', ['bi', 'ci', 'cle', 'ta']]]],
  ['Cazadora experta', [['mermelada', ['mer', 'me', 'la', 'da']], ['calabaza', ['ca', 'la', 'ba', 'za']], ['mandarina', ['man', 'da', 'ri', 'na']]]],
  ['Trabadas largas', [['escalera', ['es', 'ca', 'le', 'ra']], ['cocodrilo', ['co', 'co', 'dri', 'lo']], ['estrellita', ['es', 'tre', 'lli', 'ta']]]],
  ['Cinco sílabas', [['computadora', ['com', 'pu', 'ta', 'do', 'ra']], ['hipopótamo', ['hi', 'po', 'pó', 'ta', 'mo']], ['murciélago', ['mur', 'cié', 'la', 'go']]]],
  ['Súper largas', [['helicóptero', ['he', 'li', 'cóp', 'te', 'ro']], ['supermercado', ['su', 'per', 'mer', 'ca', 'do']], ['maravilloso', ['ma', 'ra', 'vi', 'llo', 'so']]]],
  ['Casi maestra', [['veterinaria', ['ve', 'te', 'ri', 'na', 'ria']], ['ferrocarril', ['fe', 'rro', 'ca', 'rril']], ['primavera', ['pri', 'ma', 've', 'ra']]]],
  ['Nivel Male', [['extraterrestre', ['ex', 'tra', 'te', 'rres', 'tre']], ['rompecabezas', ['rom', 'pe', 'ca', 'be', 'zas']], ['paracaidista', ['pa', 'ra', 'cai', 'dis', 'ta']]]],
];

// ── Palabras Gemelas ──────────────────────────────────────────────────────────
type ParGemelas = [a: string, b: string, gemelas: boolean];
type DatoGemelas = [titulo: string, pares: ParGemelas[]];

const GEMELAS: DatoGemelas[] = [
  ['Gemelas nivel 1', [['lobo', 'lodo', false], ['pato', 'pato', true], ['bola', 'dola', false], ['pelo', 'pelo', true], ['cama', 'cana', false]]],
  ['Gemelas nivel 2', [['perro', 'perro', true], ['tigre', 'tigro', false], ['árbol', 'árbol', true], ['dragón', 'dragón', true], ['ratón', 'patón', false]]],
  ['Gemelas nivel 3', [['globo', 'glovo', false], ['paloma', 'paloma', true], ['flecha', 'flacha', false], ['queso', 'queso', true], ['plato', 'ploto', false]]],
  ['¿b o d?', [['burro', 'durro', false], ['dado', 'dado', true], ['boca', 'doca', false], ['banco', 'banco', true], ['dedo', 'bedo', false]]],
  ['¿p o q?', [['queso', 'peso', false], ['pino', 'pino', true], ['quinto', 'pinto', false], ['paquete', 'paquete', true], ['quema', 'pema', false]]],
  ['¿m o n?', [['mono', 'nono', false], ['mamá', 'mamá', true], ['nido', 'mido', false], ['montaña', 'montaña', true], ['manta', 'nanta', false]]],
  ['Al revés', [['sol', 'los', false], ['ala', 'ala', true], ['sal', 'las', false], ['oso', 'oso', true], ['sapo', 'sopa', false]]],
  ['Letras bailarinas', [['forma', 'froma', false], ['brazo', 'brazo', true], ['padre', 'parde', false], ['trampa', 'trampa', true], ['prado', 'pardo', false]]],
  ['Gemelas expertas', [['banda', 'danda', false], ['piedra', 'piedra', true], ['madera', 'nadera', false], ['bombero', 'bombero', true], ['quitar', 'pitar', false]]],
  ['Casi iguales', [['sombrero', 'sonbrero', false], ['camisa', 'camisa', true], ['pantalón', 'pantalón', true], ['vestido', 'vestibo', false], ['zapatilla', 'zapafilla', false]]],
  ['¿ñ o n?', [['niño', 'nino', false], ['año', 'año', true], ['sueño', 'sueno', false], ['araña', 'araña', true], ['muñeca', 'nuñeca', false]]],
  ['Letras dobles', [['carro', 'caro', false], ['llave', 'llave', true], ['perro', 'pero', false], ['sello', 'sello', true], ['gorra', 'gora', false]]],
  ['Palabras largas', [['elefante', 'elefamte', false], ['chocolate', 'chocolate', true], ['dinosaurio', 'binosaurio', false], ['computadora', 'computadora', true], ['bicicleta', 'dicicleta', false]]],
  ['Gemelas maestras', [['cocodrilo', 'cocodrilo', true], ['mariposa', 'mariqosa', false], ['caracol', 'caracol', true], ['tormenta', 'tornenta', false], ['escudo', 'escubo', false]]],
  ['Nivel Male', [['estrella', 'esfrella', false], ['princesa', 'princesa', true], ['biblioteca', 'diblioteca', false], ['rinoceronte', 'rinoceronte', true], ['hamburguesa', 'hamdurguesa', false]]],
];

// ── Intruso de las Rimas ──────────────────────────────────────────────────────
type GrupoRima = [palabras: string[], intruso: string];
type DatoRimas = [titulo: string, grupos: GrupoRima[]];

const RIMAS: DatoRimas[] = [
  ['Rimas nivel 1', [[['canción', 'avión'], 'gato'], [['pato', 'plato'], 'luna'], [['flor', 'calor'], 'mesa']]],
  ['Rimas nivel 2', [[['sol', 'col'], 'pan'], [['mar', 'dar'], 'carro'], [['tren', 'bien'], 'pato']]],
  ['Rimas nivel 3', [[['ratón', 'cartón'], 'lago'], [['amor', 'dolor'], 'mesa'], [['pan', 'plan'], 'nube']]],
  ['Rimas -ito', [[['gatito', 'patito', 'mosquito'], 'luna'], [['caballito', 'pajarito', 'conejito'], 'flor'], [['ratoncito', 'pececito', 'osito'], 'mesa']]],
  ['Rimas -ada', [[['helada', 'ensalada', 'almohada'], 'gato'], [['hada', 'espada', 'granada'], 'libro'], [['manada', 'limonada', 'mermelada'], 'sol']]],
  ['Rimas -ero', [[['sombrero', 'bombero', 'carpintero'], 'luna'], [['caballero', 'cocinero', 'jardinero'], 'nube'], [['florero', 'velero', 'granjero'], 'pan']]],
  ['Rimas -ina', [[['bailarina', 'golondrina', 'mandarina'], 'perro'], [['cocina', 'esquina', 'gallina'], 'árbol'], [['piscina', 'harina', 'sardina'], 'tren']]],
  ['Rimas -illa', [[['silla', 'ardilla', 'semilla'], 'zapato'], [['maravilla', 'vainilla', 'zapatilla'], 'camión'], [['rodilla', 'mejilla', 'sombrilla'], 'queso']]],
  ['Rimas expertas', [[['botón', 'ratón', 'jabón'], 'pelota'], [['estrella', 'botella', 'huella'], 'camino'], [['canción', 'corazón', 'melón'], 'queso']]],
  ['Rimas -or', [[['tambor', 'calor', 'dolor'], 'silla'], [['amor', 'sabor', 'color'], 'gusano'], [['doctor', 'pintor', 'tractor'], 'estrella']]],
  ['Rimas -ente', [[['valiente', 'caliente', 'serpiente'], 'manzana'], [['puente', 'fuente', 'diente'], 'caracol'], [['gente', 'frente', 'mente'], 'tortuga']]],
  ['Rimas -oso', [[['oso', 'goloso', 'curioso'], 'botella'], [['famoso', 'gracioso', 'peligroso'], 'martillo'], [['hermoso', 'mimoso', 'baboso'], 'ventana']]],
  ['Rimas -eta', [[['galleta', 'bicicleta', 'camiseta'], 'dragón'], [['paleta', 'raqueta', 'trompeta'], 'castillo'], [['maleta', 'carreta', 'avioneta'], 'espejo']]],
  ['Rimas maestras', [[['gigante', 'elegante', 'picante'], 'gusano'], [['caracol', 'girasol', 'farol'], 'caramelo'], [['tortuga', 'lechuga', 'oruga'], 'tomate']]],
  ['Nivel Male', [[['campeón', 'avión', 'león'], 'pera'], [['princesa', 'sorpresa', 'frambuesa'], 'dinosaurio'], [['chocolate', 'tomate', 'disparate'], 'mariposa']]],
];

// ── Conductor del Texto ───────────────────────────────────────────────────────
type PreguntaDato = [pregunta: string, opciones: string[], correcta: string];
type DatoTexto = [titulo: string, texto: string, minAciertos: number, preguntas: PreguntaDato[]];

const TEXTOS: DatoTexto[] = [
  [
    'El gato Michi',
    'El gato Michi vive en una casa roja. Le gusta saltar y jugar con la pelota azul.',
    2,
    [
      ['La pelota era de color ___', ['roja', 'azul', 'verde'], 'azul'],
      ['La casa de Michi es ___', ['azul', 'verde', 'roja'], 'roja'],
      ['A Michi le gusta ___', ['dormir', 'saltar', 'nadar'], 'saltar'],
    ],
  ],
  [
    'Bruno el oso',
    'Bruno el oso vive en el bosque. Cada mañana busca miel en los árboles. Su color favorito es el marrón.',
    2,
    [
      ['Bruno vive en el ___', ['bosque', 'mar', 'campo'], 'bosque'],
      ['Cada mañana Bruno busca ___', ['fruta', 'miel', 'peces'], 'miel'],
      ['El color favorito de Bruno es el ___', ['azul', 'verde', 'marrón'], 'marrón'],
    ],
  ],
  [
    'Sofía pinta',
    'Sofía ama pintar. Un día pintó un arcoíris enorme en su cuaderno. Usó siete colores y tardó una hora.',
    2,
    [
      ['Sofía ama ___', ['cantar', 'pintar', 'saltar'], 'pintar'],
      ['Sofía pintó un ___', ['sol', 'arcoíris', 'árbol'], 'arcoíris'],
      ['Sofía tardó ___', ['dos horas', 'media hora', 'una hora'], 'una hora'],
    ],
  ],
  [
    'La gata Misu',
    'La gata Misu duerme arriba del ropero. Hoy bajó de un salto porque escuchó abrirse una lata de atún en la cocina.',
    2,
    [
      ['Misu duerme arriba del ___', ['sillón', 'ropero', 'auto'], 'ropero'],
      ['Misu escuchó una lata de ___', ['atún', 'tomate', 'duraznos'], 'atún'],
      ['El sonido venía de ___', ['el patio', 'la cocina', 'el baño'], 'la cocina'],
    ],
  ],
  [
    'La sirena Perla',
    'La sirena Perla colecciona caracoles rosados. Su mejor amiga es una tortuga vieja que conoce todos los secretos del mar.',
    2,
    [
      ['Perla colecciona ___', ['estrellas', 'caracoles', 'piedras'], 'caracoles'],
      ['Los caracoles son ___', ['rosados', 'azules', 'dorados'], 'rosados'],
      ['Su mejor amiga es una ___', ['ballena', 'tortuga', 'gaviota'], 'tortuga'],
    ],
  ],
  [
    'El dino Rocco',
    'Rocco es un dinosaurio verde que ama las frutillas. Una mañana encontró un canasto lleno en el bosque y lo compartió con sus tres amigos.',
    3,
    [
      ['Rocco es de color ___', ['azul', 'verde', 'rojo'], 'verde'],
      ['A Rocco le encantan las ___', ['frutillas', 'manzanas', 'peras'], 'frutillas'],
      ['Rocco encontró un canasto en ___', ['el bosque', 'la playa', 'su casa'], 'el bosque'],
      ['Lo compartió con ___ amigos', ['dos', 'tres', 'cuatro'], 'tres'],
    ],
  ],
  [
    'El pirata Tito',
    'El pirata Tito perdió su loro en la isla. Siguió las plumas verdes hasta una palmera alta. El loro estaba comiendo cocos y no quería bajar.',
    3,
    [
      ['Tito perdió su ___', ['mapa', 'loro', 'barco'], 'loro'],
      ['Tito siguió las ___', ['huellas', 'plumas', 'monedas'], 'plumas'],
      ['El loro estaba en una ___', ['palmera', 'cueva', 'roca'], 'palmera'],
      ['El loro comía ___', ['bananas', 'cocos', 'semillas'], 'cocos'],
    ],
  ],
  [
    'La tortuga Trini',
    'La tortuga Trini encontró un sombrero amarillo en la playa. Se lo puso para caminar bajo el sol. Un cangrejo le dijo que le quedaba muy bien y caminaron juntos hasta el mar.',
    3,
    [
      ['Trini encontró un ___', ['sombrero', 'zapato', 'caracol'], 'sombrero'],
      ['El sombrero era de color ___', ['rojo', 'amarillo', 'verde'], 'amarillo'],
      ['Trini lo encontró en ___', ['el bosque', 'la playa', 'su casa'], 'la playa'],
      ['Caminaron juntos hasta ___', ['el mar', 'la montaña', 'el río'], 'el mar'],
    ],
  ],
  [
    'El robot Bolt',
    'El robot Bolt funciona con jugo de naranja. Cada lunes ayuda a la abuela a regar las plantas y juntos cantan canciones viejas.',
    3,
    [
      ['Bolt funciona con ___', ['pilas', 'jugo de naranja', 'agua'], 'jugo de naranja'],
      ['Bolt ayuda cada ___', ['lunes', 'viernes', 'domingo'], 'lunes'],
      ['Bolt ayuda a ___', ['la abuela', 'el vecino', 'su mamá'], 'la abuela'],
      ['Juntos riegan ___', ['el pasto', 'las plantas', 'los árboles'], 'las plantas'],
    ],
  ],
  [
    'La feria',
    'Male fue a la feria con su papá. Subieron tres veces a la rueda gigante y ganaron un oso enorme en el juego de los aros.',
    3,
    [
      ['Male fue a la feria con ___', ['su papá', 'su tía', 'su amiga'], 'su papá'],
      ['Subieron a la rueda ___ veces', ['dos', 'tres', 'cinco'], 'tres'],
      ['Ganaron un ___', ['perro', 'oso', 'dino'], 'oso'],
      ['Lo ganaron en el juego de ___', ['los dardos', 'los aros', 'la pesca'], 'los aros'],
    ],
  ],
  [
    'El unicornio Nube',
    'El unicornio Nube pinta arcoíris con su cuerno. Un día se quedó sin color amarillo y lo buscó dentro de un girasol gigante.',
    3,
    [
      ['Nube pinta arcoíris con su ___', ['cola', 'cuerno', 'pata'], 'cuerno'],
      ['Se quedó sin color ___', ['rojo', 'amarillo', 'azul'], 'amarillo'],
      ['Lo buscó dentro de un ___', ['girasol', 'limón', 'sol'], 'girasol'],
      ['El girasol era ___', ['chiquito', 'gigante', 'rosado'], 'gigante'],
    ],
  ],
  [
    'La carrera del bosque',
    'Los animales hicieron una carrera en el bosque. La liebre se durmió bajo un pino y la tortuga cruzó la meta primero. Todos festejaron con torta de zanahoria.',
    3,
    [
      ['La carrera fue en ___', ['el bosque', 'la ciudad', 'la playa'], 'el bosque'],
      ['La liebre se durmió bajo un ___', ['pino', 'puente', 'sauce'], 'pino'],
      ['La que ganó fue ___', ['la liebre', 'la tortuga', 'la ardilla'], 'la tortuga'],
      ['Festejaron con torta de ___', ['chocolate', 'zanahoria', 'frutilla'], 'zanahoria'],
    ],
  ],
  [
    'El dragón panadero',
    'El dragón Memo trabaja en una panadería. Con su fuego dora el pan y las medialunas. Los vecinos hacen fila cada mañana para comprarle.',
    3,
    [
      ['Memo trabaja en una ___', ['panadería', 'escuela', 'granja'], 'panadería'],
      ['Memo dora el pan con su ___', ['horno', 'fuego', 'sol'], 'fuego'],
      ['Además del pan, dora ___', ['tortas', 'medialunas', 'galletas'], 'medialunas'],
      ['Los vecinos hacen fila cada ___', ['mañana', 'tarde', 'noche'], 'mañana'],
    ],
  ],
  [
    'El dragón Chispa',
    'El dragón Chispa no sabía volar. Cada tarde practicaba saltando desde una roca baja. Una noche de viento fuerte, abrió las alas y voló hasta la luna llena. Desde entonces, vuela todas las noches con su amiga la lechuza.',
    3,
    [
      ['Chispa no sabía ___', ['nadar', 'volar', 'cantar'], 'volar'],
      ['Practicaba saltando desde ___', ['una roca', 'un árbol', 'su cama'], 'una roca'],
      ['Una noche voló hasta ___', ['el sol', 'la luna', 'el mar'], 'la luna'],
      ['Su amiga es ___', ['la lechuza', 'el cangrejo', 'la tortuga'], 'la lechuza'],
    ],
  ],
  [
    'El viaje a la luna',
    'Male soñó que viajaba a la luna en un cohete de cartón. Allí conoció a un dino astronauta que le regaló una estrella plateada. Al despertar, la estrella brillaba en su ventana.',
    3,
    [
      ['Male viajaba en un cohete de ___', ['cartón', 'metal', 'madera'], 'cartón'],
      ['En la luna conoció a un ___', ['robot', 'dino astronauta', 'conejo'], 'dino astronauta'],
      ['El dino le regaló una ___', ['piedra', 'estrella', 'flor'], 'estrella'],
      ['La estrella brillaba en ___', ['su mochila', 'su ventana', 'el cielo'], 'su ventana'],
    ],
  ],
];

// ── Memotest ──────────────────────────────────────────────────────────────────
const PALABRA_MEMOTEST: Record<string, string> = {
  flor: 'flor',
  corazon: 'corazón',
  casa: 'casa',
  dino: 'dino',
  oso: 'oso',
  auto: 'auto',
  mariposa: 'mariposa',
  galleta: 'galleta',
  oruga: 'oruga',
  cangrejo: 'cangrejo',
  zapato: 'zapato',
  hoja: 'hoja',
};

const cartasMemotest = (imagenes: string[]): CartaMemotest[] =>
  imagenes.flatMap((imagen) => [
    { id: `${imagen}-a`, contenido: PALABRA_MEMOTEST[imagen], pairId: imagen, imagenUrl: imagen },
    { id: `${imagen}-b`, contenido: PALABRA_MEMOTEST[imagen], pairId: imagen, imagenUrl: imagen },
  ]);

type DatoMemotest = [titulo: string, imagenes: string[]];

const MEMOTEST: DatoMemotest[] = [
  ['Primeras parejas', ['flor', 'corazon', 'casa']],
  ['Tres parejas más', ['dino', 'oso', 'auto']],
  ['Cuatro parejas', ['mariposa', 'galleta', 'oruga', 'cangrejo']],
  ['Sigue buscando', ['zapato', 'hoja', 'flor', 'dino']],
  ['Cinco parejas', ['casa', 'oso', 'auto', 'corazon', 'galleta']],
  ['Memoria despierta', ['mariposa', 'oruga', 'zapato', 'hoja', 'cangrejo']],
  ['Seis parejas', ['flor', 'corazon', 'casa', 'dino', 'oso', 'auto']],
  ['Todo mezclado', ['mariposa', 'galleta', 'oruga', 'cangrejo', 'zapato', 'hoja']],
  ['Memoria fuerte', ['flor', 'dino', 'auto', 'galleta', 'oruga', 'zapato']],
  ['Siete parejas', ['corazon', 'casa', 'oso', 'mariposa', 'cangrejo', 'hoja', 'flor']],
  ['Súper memoria', ['dino', 'auto', 'galleta', 'oruga', 'zapato', 'corazon', 'mariposa']],
  ['Ocho parejas', ['flor', 'corazon', 'casa', 'dino', 'oso', 'auto', 'mariposa', 'galleta']],
  ['Memoria experta', ['oruga', 'cangrejo', 'zapato', 'hoja', 'flor', 'dino', 'oso', 'auto']],
  ['Memoria maestra', ['corazon', 'casa', 'mariposa', 'galleta', 'oruga', 'cangrejo', 'zapato', 'hoja']],
  ['Nivel Male', ['dino', 'oso', 'auto', 'flor', 'mariposa', 'cangrejo', 'galleta', 'corazon']],
];

// ── Carrera de Lectura ────────────────────────────────────────────────────────
type DatoCarrera = [titulo: string, segundosPorPalabra: number, palabras: string[]];

const CARRERA: DatoCarrera[] = [
  ['¡Arranca el dino!', 3.5, ['sol', 'pan', 'mar', 'luz', 'pie', 'sal', 'oso', 'uva']],
  ['Primera carrera', 3.2, ['gato', 'luna', 'mesa', 'pato', 'casa', 'nube', 'taza', 'mano', 'pelo', 'boca']],
  ['Más veloz', 3.0, ['perro', 'libro', 'silla', 'agua', 'leche', 'cielo', 'playa', 'torta', 'mamá', 'papá']],
  ['Ruedas calientes', 2.8, ['árbol', 'lápiz', 'verde', 'fuego', 'lluvia', 'piedra', 'globo', 'fruta', 'noche', 'sueño', 'barco', 'viento']],
  ['Tres sílabas', 2.7, ['pelota', 'banana', 'camino', 'zapato', 'conejo', 'paloma', 'tomate', 'helado', 'cocina', 'ventana', 'manzana', 'sandía']],
  ['A toda marcha', 2.6, ['caballo', 'gallina', 'pescado', 'semilla', 'campana', 'botella', 'galleta', 'nevera', 'mochila', 'cuchara', 'almohada', 'naranja']],
  ['Curvas trabadas', 2.5, ['plátano', 'estrella', 'brújula', 'flauta', 'globito', 'plancha', 'frutilla', 'tigre', 'cofre', 'sombra', 'cuadro', 'piedrita']],
  ['Carrera larga', 2.4, ['mariposa', 'chocolate', 'elefante', 'bicicleta', 'caracola', 'mandarina', 'ensalada', 'mermelada', 'escalera', 'pelícano', 'tortuga', 'delfín', 'ballena', 'pingüino']],
  ['Motor a fondo', 2.3, ['dinosaurio', 'caballito', 'calabaza', 'golondrina', 'zanahoria', 'biblioteca', 'cocodrilo', 'murciélago', 'telaraña', 'campanita', 'caramelo', 'tobogán', 'manguera', 'tijeras']],
  ['Pista difícil', 2.2, ['computadora', 'hipopótamo', 'helicóptero', 'mariquita', 'espantapájaros', 'lavarropas', 'paraguas', 'periódico', 'almanaque', 'remolino', 'cangrejo', 'avestruz', 'jirafa', 'koala', 'serpiente', 'tiburón']],
  ['Vuelta rápida', 2.1, ['primavera', 'ferrocarril', 'veterinaria', 'supermercado', 'maravilloso', 'temporada', 'aventura', 'tesoro', 'castillo', 'princesa', 'dragón', 'caballero', 'espada', 'corona', 'reino', 'bosque']],
  ['Carrera espacial', 2.0, ['astronauta', 'telescopio', 'meteorito', 'cohete', 'planeta', 'galaxia', 'estrella', 'satélite', 'gravedad', 'universo', 'marciano', 'órbita', 'eclipse', 'cometa', 'asteroide', 'nebulosa']],
  ['Súper pilota', 1.9, ['extraterrestre', 'rompecabezas', 'paracaidista', 'refrigerador', 'electricidad', 'fotografía', 'melodía', 'orquesta', 'guitarra', 'tambores', 'trompeta', 'violín', 'piano', 'flauta', 'canción', 'concierto', 'escenario', 'aplausos']],
  ['Casi campeona', 1.9, ['murciélago', 'hipopótamo', 'rinoceronte', 'orangután', 'chimpancé', 'flamenco', 'pelícano', 'camaleón', 'escarabajo', 'libélula', 'luciérnaga', 'saltamontes', 'mariquita', 'hormiguero', 'escorpión', 'tarántula', 'ciempiés', 'caracol', 'babosa', 'grillo']],
  ['¡Gran final de Male!', 1.8, ['extraordinario', 'imaginación', 'felicitaciones', 'espectacular', 'increíble', 'fantástico', 'campeonato', 'velocidad', 'aceleración', 'competencia', 'entrenamiento', 'resistencia', 'concentración', 'celebración', 'medallero', 'trofeo', 'podio', 'victoria', 'aplausos', 'campeona']],
];

// ── Armado final ──────────────────────────────────────────────────────────────
const NIVELES_LOCALES: Record<TipoJuego, Nivel[]> = {
  cazador_silabas: CAZADOR.map(([titulo, palabras], i) =>
    nivel('cazador_silabas', i + 1, titulo, {
      tipo: 'cazador_silabas',
      minAciertos: 3,
      palabras: palabras.map(([palabra, silabas]) => ({ palabra, silabas })),
    }),
  ),

  palabras_gemelas: GEMELAS.map(([titulo, pares], i) =>
    nivel('palabras_gemelas', i + 1, titulo, {
      tipo: 'palabras_gemelas',
      minAciertos: 3,
      pares: pares.map(([palabraA, palabraB, sonGemelas]) => ({ palabraA, palabraB, sonGemelas })),
    }),
  ),

  intruso_rimas: RIMAS.map(([titulo, grupos], i) =>
    nivel('intruso_rimas', i + 1, titulo, {
      tipo: 'intruso_rimas',
      minAciertos: 3,
      grupos: grupos.map(([palabras, intruso]) => ({ palabras, intruso })),
    }),
  ),

  conductor_texto: TEXTOS.map(([titulo, texto, minAciertos, preguntas], i) =>
    nivel('conductor_texto', i + 1, titulo, {
      tipo: 'conductor_texto',
      texto,
      minAciertos,
      preguntas: preguntas.map(([pregunta, opciones, respuestaCorrecta]) => ({
        pregunta,
        opciones,
        respuestaCorrecta,
      })),
    }),
  ),

  memotest: MEMOTEST.map(([titulo, imagenes], i) =>
    nivel('memotest', i + 1, titulo, {
      tipo: 'memotest',
      minAciertos: imagenes.length,
      cartas: cartasMemotest(imagenes),
    }),
  ),

  carrera_lectura: CARRERA.map(([titulo, segundosPorPalabra, palabras], i) =>
    nivel(
      'carrera_lectura',
      i + 1,
      titulo,
      {
        tipo: 'carrera_lectura',
        palabras,
        segundosPorPalabra,
        minAciertos: palabras.length,
      },
      Math.round(palabras.length * segundosPorPalabra),
    ),
  ),
};

export const TOTAL_NIVELES_LOCALES = Object.fromEntries(
  (Object.keys(NIVELES_LOCALES) as TipoJuego[]).map((t) => [t, NIVELES_LOCALES[t].length]),
) as Record<TipoJuego, number>;

export function getNivelesLocales(tipoJuego: TipoJuego): Nivel[] {
  return NIVELES_LOCALES[tipoJuego] ?? [];
}
