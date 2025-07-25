import { FaRegUser } from "react-icons/fa";
import { RiBankLine } from "react-icons/ri";
import { LiaClipboardListSolid } from "react-icons/lia";
// import { LiaCoinsSolid } from "react-icons/lia";
// import { FiSettings } from "react-icons/fi";
// import { HiMiniSquaresPlus } from "react-icons/hi2";
import { PERMISSIONS_TYPE } from "../types/models/permissions";
import routes from "../routes/routes";

const data = [
  {
    icon: <FaRegUser className="w-8 h-8" />,
    title: "Perfil",
    subtitles: [
      {
        name: "Usuários",
        link: routes.USERS,
      },
    ],
  },
  {
    icon: <RiBankLine className="w-8 h-8" />,
    title: "Administrativo",
    subtitles: [
      { name: "Clientes", link: routes.CUSTOMERS },
      // {
      //   name: "Cadastro 3º",
      //   link: routes.EXTERNAL_CUSTOMERS,
      //   permission: PERMISSIONS_TYPE.GET_EXTERNAL_CUSTOMER,
      // },
      {
        name: "Transportes",
        link: routes.TRANSPORT,
      },
      // {
      //   name: "Estoque",
      //   link: routes.USERS,
      //   permission: PERMISSIONS_TYPE.GET_USER,
      // },
      // {
      //   name: "Financeiro",
      //   link: routes.USERS,
      //   permission: PERMISSIONS_TYPE.GET_USER,
      // },
      // {
      //   name: "Relatório",
      //   link: routes.USERS,
      //   permission: PERMISSIONS_TYPE.GET_USER,
      // },
    ],
  },
  {
    icon: <LiaClipboardListSolid className="w-8 h-8" />,
    title: "Ordem de Serviço",
    subtitles: [
      // {
      //   name: "Aprovação",
      //   link: routes.USERS,
      //   permission: PERMISSIONS_TYPE.GET_USER,
      // },
      {
        name: "Histórico",
        link: routes.SERVICE_ORDER,
      },
      // {
      //   name: "Produção",
      //   link: routes.USERS,
      //   permission: PERMISSIONS_TYPE.GET_USER,
      // },
      {
        name: "PCP",
        link: routes.PCP,
      },
      {
        name: "Entregas do Dia",
        link: routes.DELIVERIES_OF_THE_DAY,
      },
      {
        name: "Faturamento",
        link: routes.INVOICE_SERVICE_ORDER,
      },
      // {
      //   name: "Sistema Antigo",
      //   link: routes.USERS,
      //   permission: PERMISSIONS_TYPE.GET_USER,
      // },
    ],
  },
  // {
  //   icon: <HiMiniSquaresPlus className="w-8 h-8" />,
  //   title: "Gravação",
  //   subtitles: [
  //     {
  //       name: "Estoque",
  //       link: routes.USERS,
  //       permission: PERMISSIONS_TYPE.GET_USER,
  //     },
  //     {
  //       name: "Medidas",
  //       link: routes.USERS,
  //       permission: PERMISSIONS_TYPE.GET_USER,
  //     },
  //   ],
  // },
  // {
  //   icon: <LiaCoinsSolid className="w-8 h-8" />,
  //   title: "Comercial",
  //   subtitles: [
  //     {
  //       name: "Propostas",
  //       link: routes.USERS,
  //       permission: PERMISSIONS_TYPE.GET_USER,
  //     },
  //   ],
  // },
  // {
  //   icon: <FiSettings className="w-8 h-8" />,
  //   title: "Configurações",
  //   subtitles: [
  //     {
  //       name: "Permissões",
  //       link: routes.USERS,
  //       permission: PERMISSIONS_TYPE.GET_USER,
  //     },
  //     {
  //       name: "Transportes",
  //       link: routes.USERS,
  //       permission: PERMISSIONS_TYPE.GET_USER,
  //     },
  //   ],
  // },
];

export default data;
