import {
  BookOpen,
  ExternalLink,
  Globe,
  HandHeart,
  Mail,
  MapPin,
  Phone,
  Search,
  TriangleAlert,
} from 'lucide-react';
import logo from '../assets/logo-psicoinfo.png';
import Breadcrumb from '../components/Breadcrumb';
import CallButton from '../components/CallButton';
import Container from '../components/Container';
import InfoSection from '../components/InfoSection';
import MapButton from '../components/MapButton';
import { soDigitos } from '../data/links';
import { obterSobre } from '../data/servicos';
import { useTituloPagina } from '../hooks/useTituloPagina';
import type { Telefone } from '../types';
import styles from './Sobre.module.css';

/** Passos de uso: são mesmo uma sequência, por isso a lista numerada. */
const PASSOS = [
  'Escreva o que você precisa na busca, ou escolha um assunto.',
  'Toque no serviço para ver endereço, telefone e o que ele oferece.',
  'Ligue antes de ir ou toque em "Ver no mapa" para saber como chegar.',
];

function Sobre() {
  useTituloPagina('Sobre o PsicoInfo');
  const sobre = obterSobre();

  const telefones: Telefone[] = [
    {
      numero: sobre.telefone,
      discar: soDigitos(sobre.telefone),
      tipo: 'fixo',
      rotulo: null,
    },
    {
      numero: sobre.whatsapp,
      discar: soDigitos(sobre.whatsapp),
      tipo: 'whatsapp',
      rotulo: null,
    },
  ];

  const redes = [
    { rotulo: 'Site da ACARI', url: sobre.site, icone: Globe },
    { rotulo: 'Instagram', url: sobre.instagram, icone: ExternalLink },
    { rotulo: 'YouTube', url: sobre.youtube, icone: ExternalLink },
  ];

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
              titulo="De onde vêm as informações"
              icone={BookOpen}
            >
              <p>
                Os serviços foram tirados da cartilha{' '}
                <strong>
                  “Serviços da Rede de Proteção – Petrolina e Juazeiro”
                </strong>
                , feita pela {sobre.realizacao}, no {sobre.projeto}.
              </p>
              <p>
                Em setembro de 2026, os dados foram conferidos e completados com
                informações dos sites oficiais da Prefeitura de Petrolina e de
                outros órgãos públicos.
              </p>
              <p>Aqui aparecem só os serviços de Petrolina.</p>
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
            id="bloco-acari"
            titulo="Quem fez a cartilha"
            icone={HandHeart}
          >
            <p className={styles.destaque}>{sobre.realizacao}</p>
            <p>{sobre.descricao}</p>

            <h3 className={styles.subtitulo}>
              <MapPin aria-hidden="true" size={20} /> Endereço
            </h3>
            <p>{sobre.endereco}</p>
            <MapButton mapaQuery={sobre.endereco} />

            <h3 className={styles.subtitulo}>
              <Phone aria-hidden="true" size={20} /> Telefones
            </h3>
            <ul className={styles.lista}>
              {telefones.map((telefone) => (
                <li key={telefone.discar}>
                  <CallButton telefone={telefone} />
                </li>
              ))}
            </ul>

            <h3 className={styles.subtitulo}>
              <Mail aria-hidden="true" size={20} /> Na internet
            </h3>
            <ul className={styles.links}>
              <li>
                <a href={`mailto:${sobre.email}`} className={styles.link}>
                  <Mail aria-hidden="true" size={22} />
                  <span>{sobre.email}</span>
                </a>
              </li>
              {redes.map(({ rotulo, url, icone: Icone }) => (
                <li key={url}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    <Icone aria-hidden="true" size={22} />
                    <span>{rotulo}</span>
                    <span className="visually-hidden">
                      {' '}
                      (abre em outra aba)
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </InfoSection>
        </div>
      </Container>
    </div>
  );
}

export default Sobre;
