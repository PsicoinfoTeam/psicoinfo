import {
  BookOpen,
  HandHeart,
  Search,
  TriangleAlert,
  Users,
} from 'lucide-react';
import logo from '../assets/logo-psicoinfo.png';
import Breadcrumb from '../components/Breadcrumb';
import Container from '../components/Container';
import InfoSection from '../components/InfoSection';
import { useTituloPagina } from '../hooks/useTituloPagina';
import styles from './Sobre.module.css';

/** Passos de uso: são mesmo uma sequência, por isso a lista numerada. */
const PASSOS = [
  'Escreva o que você precisa na busca, ou escolha um assunto.',
  'Toque no serviço para ver endereço, telefone e o que ele oferece.',
  'Ligue antes de ir ou toque em "Ver no mapa" para saber como chegar.',
];

const INTEGRANTES = [
  'Enzo Lima',
  'Igor Macêdo',
  'João Victor Vasconcelos',
  'Josilene Alves',
  'Lara Gonzalez',
  'Maria Clara Granja',
  'Maria Luísa Bompastor',
  'Waitusy de Araújo',
];

function Sobre() {
  useTituloPagina('Sobre o PsicoInfo');

  return (
    <div className={styles.pagina}>
      <Container>
        <Breadcrumb />

        <header className={styles.cabecalho}>
          <img
            src={logo}
            alt=""
            className={styles.logo}
            width={632}
            height={480}
          />
          <div className={styles.intro}>
            <h1>Sobre o PsicoInfo</h1>
            <p className={styles.lead}>
              O PsicoInfo ajuda você a encontrar serviços públicos e de
              assistência em Petrolina: saúde, assistência social, direitos e
              proteção. Não precisa saber antes o nome nem o endereço do lugar.
            </p>
          </div>
        </header>

        <div className={styles.grade}>
          <div className={styles.coluna}>
            <InfoSection id="bloco-como-usar" titulo="Como usar" icone={Search}>
              <ol className={styles.passos}>
                {PASSOS.map((passo) => (
                  <li key={passo}>{passo}</li>
                ))}
              </ol>
            </InfoSection>

            <InfoSection
              id="bloco-fonte"
              titulo="Fonte dos dados"
              icone={BookOpen}
            >
              <p>
                As informações disponibilizadas neste site foram coletadas em
                fontes oficiais e públicas disponíveis na internet, buscando
                garantir a confiabilidade e a atualização dos dados.
              </p>
              <p className={styles.aviso}>Atualizado em: outubro de 2026.</p>
            </InfoSection>

            <InfoSection
              id="bloco-aviso"
              titulo="Antes de ir, confirme"
              icone={TriangleAlert}
            >
              <p className={styles.aviso}>
                Telefones, endereços e horários podem mudar. Se puder, ligue
                antes de sair de casa.
              </p>
              <p>
                Em emergência, ligue <a href="tel:192">192 (SAMU)</a> ou{' '}
                <a href="tel:190">190 (Polícia)</a>.
              </p>
            </InfoSection>
          </div>
          <InfoSection
            id="bloco-origem"
            titulo="Por que nasceu o PsicoInfo?"
            icone={HandHeart}
          >
            <p>
              O PsicoInfo nasceu a partir de uma proposta pensada e
              compartilhada pela docente Layta, responsável pela disciplina de
              Intervenções Psicossociais do 6º período do curso de Psicologia da
              FACAPE.
            </p>
            <p>
              A proposta surgiu com o objetivo de aproximar estudantes e futuros
              profissionais da comunidade e ampliar o acesso à informação sobre
              saúde mental. Mas, para nós, falar sobre saúde mental significa ir
              além de simplesmente falar sobre doenças, diagnósticos ou
              características individuais. É preciso olhar para as pessoas, para
              suas histórias e também para os lugares onde suas vidas acontecem.
            </p>
            <p>
              Foi a partir desse olhar que surgiu a parceria entre os cursos de{' '}
              <strong>Psicologia</strong> e{' '}
              <strong>Ciência da Computação</strong> da FACAPE. Unimos
              conhecimentos de diferentes áreas para transformar essa proposta
              em uma ferramenta acessível, prática e voltada para a comunidade.
            </p>
            <p>
              Assim nasceu o PsicoInfo, um site desenvolvido em parceria pelos
              dois cursos, com o propósito de facilitar o acesso da população de
              Petrolina a informações sobre serviços públicos, saúde,
              assistência social e outros recursos disponíveis no município.
              Mais do que reunir informações, o PsicoInfo busca aproximar a
              comunidade dos serviços que podem fazer parte do cuidado e da
              garantia de direitos.
            </p>
            <p>
              O PsicoInfo é um projeto acadêmico desenvolvido por estudantes da
              FACAPE e não possui vínculo institucional com a Prefeitura de
              Petrolina ou com os serviços públicos apresentados na plataforma.
              As informações disponibilizadas têm caráter exclusivamente
              informativo e são reunidas a partir de fontes públicas, com o
              objetivo de facilitar o acesso da população aos serviços
              disponíveis no município.
            </p>
          </InfoSection>
        </div>
        <div className={styles.equipe}>
          <InfoSection
            id="bloco-equipe"
            titulo="Equipe do projeto"
            icone={Users}
          >
            <p>
              O PsicoInfo é desenvolvido por estudantes da FACAPE, com
              orientação docente.
            </p>

            <h3 className={styles.subtituloEquipe}>Estudantes</h3>

            <ul className={styles.integrantes}>
              {INTEGRANTES.map((nome) => (
                <li key={nome}>{nome}</li>
              ))}
            </ul>

            <h3 className={styles.subtituloEquipe}>Docente responsável</h3>
            <p className={styles.docente}>Layta Ribeiro</p>
          </InfoSection>
        </div>
      </Container>
    </div>
  );
}

export default Sobre;
