import BackButton from '../components/BackButton';
import Container from '../components/Container';
import FaqItem from '../components/FaqItem';
import { useTituloPagina } from '../hooks/useTituloPagina';
import styles from './Faq.module.css';

/** Respostas conferidas com o campo "Como ser atendido" (comoAcessar) dos dados. */
const PERGUNTAS = [
  {
    pergunta: 'O que é o CRAS?',
    resposta:
      'CRAS é o Centro de Referência de Assistência Social. É a porta de entrada da assistência social: ajuda famílias a conseguir benefícios, como Bolsa Família e BPC, e oferece atendimento com assistente social e psicólogo. Petrolina tem 10 CRAS. Para saber qual atende o seu bairro, use "Encontre o CRAS mais perto de você", na página inicial.',
  },
  {
    pergunta: 'Qual a diferença entre CRAS e CREAS?',
    resposta:
      'O CRAS ajuda a família a conseguir benefícios e fortalece a convivência na família e na comunidade. O CREAS (Centro de Referência Especializado de Assistência Social) atende pessoas que tiveram seus direitos violados, como vítimas de violência, abuso, assédio ou discriminação.',
  },
  {
    pergunta: 'Preciso pagar para ser atendido?',
    resposta:
      'Não. CRAS, CREAS, postos de saúde (UBS) e os outros serviços do SUS (Sistema Único de Saúde) e do SUAS (Sistema Único de Assistência Social) são públicos e gratuitos.',
  },
  {
    pergunta: 'Preciso de encaminhamento para ser atendido?',
    resposta:
      'Depende do serviço. No posto de saúde (UBS), pode ir direto. No CRAS, agende por telefone. No CREAS, pode ir direto. No CAPS, precisa agendar. Na Policlínica, precisa de encaminhamento do posto de saúde. Na página de cada serviço, veja "Como ser atendido".',
  },
  {
    pergunta: 'O que é uma UBS (posto de saúde)?',
    resposta:
      'UBS é a Unidade Básica de Saúde, o posto de saúde do bairro. É o primeiro lugar para procurar atendimento pelo SUS. Lá tem consulta com médico e enfermeiro, dentista, vacinas, entrega de remédios e testes de HIV e sífilis.',
  },
  {
    pergunta: 'Onde consigo remédio de graça?',
    resposta:
      'Os postos de saúde (UBS) fazem entrega de remédios. Para saber quais remédios têm e o que levar, pergunte no posto de saúde do seu bairro.',
  },
];

function Faq() {
  useTituloPagina('Perguntas frequentes');

  return (
    <div className={styles.pagina}>
      <Container>
        <div className={styles.cabecalho}>
          <BackButton />
          <h1 className={styles.titulo}>Perguntas frequentes</h1>
          <p className={styles.subtitulo}>
            Reunimos as dúvidas mais comuns sobre os serviços públicos de
            Petrolina.
            <br />
            Toque na pergunta para ver a resposta.
          </p>
        </div>

        <div className={styles.listaFaq}>
          {PERGUNTAS.map((item) => (
            <FaqItem
              key={item.pergunta}
              pergunta={item.pergunta}
              resposta={item.resposta}
            />
          ))}
        </div>
      </Container>
    </div>
  );
}

export default Faq;
