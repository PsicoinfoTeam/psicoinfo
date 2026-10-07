import { Link } from 'react-router-dom';
import FaqItem from '../components/FaqItem';
import styles from './Faq.module.css';

export default function Faq() {
  const perguntas = [
    {
      pergunta: 'O que é o CRAS?',
      resposta: 'O Centro de Referência de Assistência Social (CRAS) é a porta de entrada da Assistência Social. É um local público, localizado prioritariamente em áreas de maior vulnerabilidade social, onde são oferecidos os serviços de Assistência Social em Petrolina. Através do CRAS, famílias em situação de vulnerabilidade recebem apoio, orientação e acesso a programas sociais.'
    },
    {
      pergunta: 'Qual a diferença entre CRAS e CREAS?',
      resposta: 'O CRAS atua na prevenção, fortalecendo os vínculos familiares e comunitários antes que os direitos sejam violados. Já o CREAS (Centro de Referência Especializado de Assistência Social) atende pessoas e famílias cujos direitos já foram violados (casos de violência, abuso, abandono, etc.), oferecendo apoio e acompanhamento especializado.'
    },
    {
      pergunta: 'Preciso pagar para ser atendido?',
      resposta: 'Não! Todos os serviços oferecidos pelos CRAS, CREAS, UBS (Unidades Básicas de Saúde) e demais equipamentos vinculados ao SUS (Sistema Único de Saúde) e SUAS (Sistema Único de Assistência Social) são serviços públicos e totalmente gratuitos para a população.'
    },
    {
      pergunta: 'Preciso de encaminhamento para ser atendido?',
      resposta: 'Para ser atendido no CRAS ou na UBS do seu bairro, você não precisa de encaminhamento, pois eles são a "porta de entrada" dos serviços. Basta ir até a unidade com seus documentos (RG, CPF, Comprovante de Residência e Cartão SUS/NIS). No entanto, para serviços especializados (como CREAS, CAPS e Policlínicas), o encaminhamento feito pela unidade básica geralmente é necessário.'
    },
    {
      pergunta: 'O que é uma UBS (posto de saúde)?',
      resposta: 'A Unidade Básica de Saúde (UBS), também conhecida como posto de saúde, é o local onde você recebe os primeiros atendimentos no SUS. Nela, você pode realizar consultas de rotina (clínico geral, enfermagem, odontologia), vacinação, curativos, pré-natal e acompanhamento de doenças crônicas como hipertensão e diabetes.'
    },
    {
      pergunta: 'Onde consigo medicamentos gratuitos?',
      resposta: 'Em Petrolina, os medicamentos da Relação Municipal de Medicamentos Essenciais (REMUME) podem ser retirados gratuitamente nas farmácias das próprias Unidades Básicas de Saúde (UBS) ou na Farmácia da Família. Para isso, é necessário apresentar a receita médica atualizada (do SUS ou particular), documento de identidade com foto e o Cartão SUS.'
    }
  ];

  return (
    <main className={styles.container}>
      <div className={styles.cabecalho}>
        <Link to="/" className={styles.breadcrumb}>
          Início
        </Link>
        <h1 className={styles.titulo}>Perguntas frequentes</h1>
        <p className={styles.subtitulo}>
          Reunimos as dúvidas mais comuns sobre os serviços públicos de Petrolina.<br/>
          Toque na pergunta para ver a resposta.
        </p>
      </div>

      <div className={styles.listaFaq}>
        {perguntas.map((item, index) => (
          <FaqItem
            key={index}
            pergunta={item.pergunta}
            resposta={item.resposta}
          />
        ))}
      </div>
    </main>
  );
}
