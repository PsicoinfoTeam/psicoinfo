import {
  CircleHelp,
  Clock,
  DoorOpen,
  ListChecks,
  Mail,
  MapPin,
  Phone,
  Users,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import CallButton from '../components/CallButton';
import Container from '../components/Container';
import DataIcon from '../components/DataIcon';
import InfoSection from '../components/InfoSection';
import MapButton from '../components/MapButton';
import PendingPhone from '../components/PendingPhone';
import ServiceActionBar from '../components/ServiceActionBar';
import { normalizar } from '../data/busca';
import { buscarCategoria, buscarServico } from '../data/servicos';
import { nomePorExtenso } from '../data/siglas';
import { useTituloPagina } from '../hooks/useTituloPagina';
import type { Categoria, Servico as TipoServico } from '../types';
import NaoEncontrada from './NaoEncontrada';
import styles from './Servico.module.css';

// Campos internos de revisão (pendencias, paginaCartilha, descricaoCartilha)
// nunca são exibidos nesta página.

function Servico() {
  const { id = '' } = useParams();
  const servico = buscarServico(id);

  if (!servico) {
    return (
      <NaoEncontrada
        titulo="Serviço não encontrado"
        mensagem="Não achamos este serviço. O link pode estar errado ou o serviço saiu da lista."
      />
    );
  }

  return <PaginaServico servico={servico} />;
}

/** Linha abaixo do nome: nome por extenso da sigla, ou a sigla se ela não aparece no nome. */
function subtituloDoNome(servico: TipoServico): string | null {
  const extenso = nomePorExtenso(servico);
  if (extenso) return extenso;
  if (
    servico.sigla &&
    !normalizar(servico.nome).includes(normalizar(servico.sigla))
  ) {
    return `Sigla: ${servico.sigla}`;
  }
  return null;
}

interface PaginaServicoProps {
  servico: TipoServico;
}

function PaginaServico({ servico }: PaginaServicoProps) {
  useTituloPagina(servico.nome);

  const categorias = servico.categorias
    .map(buscarCategoria)
    .filter((c): c is Categoria => c !== undefined);
  const principal = categorias.find((c) => c.id === servico.categoriaPrincipal);
  const subtitulo = subtituloDoNome(servico);

  return (
    <div className={styles.pagina}>
      <Container>
        {/* 1. Ícone, nome e categorias */}
        <Breadcrumb
          itens={
            principal
              ? [
                  {
                    rotulo: principal.nome,
                    caminho: `/categoria/${principal.id}`,
                  },
                ]
              : []
          }
        />

        <header className={styles.cabecalho}>
          <span className={styles.icone} aria-hidden="true">
            <DataIcon nome={servico.icone} size={36} strokeWidth={2} />
          </span>
          <div className={styles.nomes}>
            <h1 className={styles.nome}>{servico.nome}</h1>
            {subtitulo && <p className={styles.subtitulo}>{subtitulo}</p>}
          </div>
          <ul className={styles.chips} aria-label="Assuntos deste serviço">
            {categorias.map((categoria) => (
              <li key={categoria.id}>
                <Link to={`/categoria/${categoria.id}`} className={styles.chip}>
                  <DataIcon
                    nome={categoria.icone}
                    size={18}
                    strokeWidth={2.25}
                    aria-hidden="true"
                  />
                  {categoria.nome}
                </Link>
              </li>
            ))}
          </ul>
        </header>

        <div className={styles.grade}>
          {/* 2 a 4: onde fica, como falar, quando ir */}
          <div className={styles.contato}>
            <InfoSection id="bloco-endereco" titulo="Endereço" icone={MapPin}>
              <p className={styles.destaque}>{servico.endereco}</p>
              {servico.referencia && (
                <p>
                  <strong>Ponto de referência:</strong> {servico.referencia}
                </p>
              )}
              {servico.mapaQuery && <MapButton mapaQuery={servico.mapaQuery} />}
            </InfoSection>

            <InfoSection id="bloco-telefones" titulo="Telefones" icone={Phone}>
              {servico.telefones.length > 0 ? (
                <ul className={styles.telefones}>
                  {servico.telefones.map((telefone) => (
                    <li key={`${telefone.tipo}-${telefone.discar}`}>
                      <CallButton telefone={telefone} />
                    </li>
                  ))}
                </ul>
              ) : (
                <PendingPhone />
              )}
              {servico.email && (
                <p className={styles.email}>
                  <Mail aria-hidden="true" size={20} />
                  <span>
                    E-mail:{' '}
                    <a href={`mailto:${servico.email}`}>{servico.email}</a>
                  </span>
                </p>
              )}
            </InfoSection>

            <InfoSection id="bloco-horario" titulo="Horário" icone={Clock}>
              {servico.horario ? (
                <p className={styles.destaque}>{servico.horario}</p>
              ) : (
                <p className={styles.semHorario}>
                  Horário não informado – ligue antes de ir
                </p>
              )}
            </InfoSection>
          </div>

          {/* 5 a 8: o que é e como usar */}
          <div className={styles.detalhes}>
            <InfoSection
              id="bloco-para-que"
              titulo="Para que serve"
              icone={CircleHelp}
            >
              <p>{servico.paraQueServe}</p>
            </InfoSection>

            <InfoSection
              id="bloco-quem"
              titulo="Quem pode procurar"
              icone={Users}
            >
              <p>{servico.quemPodeProcurar}</p>
            </InfoSection>

            <InfoSection
              id="bloco-encontra"
              titulo="O que você encontra lá"
              icone={ListChecks}
            >
              <ul className={styles.lista}>
                {servico.oQueEncontra.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </InfoSection>

            <InfoSection
              id="bloco-como"
              titulo="Como ser atendido"
              icone={DoorOpen}
            >
              <p className={styles.destaque}>{servico.comoAcessar}</p>
            </InfoSection>
          </div>
        </div>
      </Container>

      {/* 9. Barra fixa no celular */}
      <ServiceActionBar servico={servico} />
    </div>
  );
}

export default Servico;
