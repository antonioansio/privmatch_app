const Footer = () => {
  return (
    <footer className="bg-zinc-950 py-8 font-medium text-white">
      <div className="container mx-auto px-4">
        <div className="mb-4 flex flex-wrap justify-center gap-6 text-sm">
          <a href="/privacy-policy">Política de Privacidad</a>
          <a href="/cookies-policy">Política de cookies</a>
          <a href="/terms-conditions">Términos y condiciones</a>
          <a href="/legal-notice">Aviso legal</a>
          <a href="/faq">FAQ</a>
          <a href="/contact">Contacto</a>
        </div>
        <hr className="my-4 border-white/40" />
        <div className="text-center text-white">
          &copy; {new Date().getFullYear()} <strong>PrivMatch</strong>. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
