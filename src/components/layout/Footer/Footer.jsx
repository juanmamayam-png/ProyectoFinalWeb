export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="mb-6">
          <h2 className="text-lg font-extrabold text-primary-700 uppercase tracking-wide">
            Universidad de la Amazonia
          </h2>
          <p className="text-sm text-gray-500">NIT: 891190346-1</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

          <div>
            <h3 className="text-xs font-bold text-primary-700 uppercase tracking-widest mb-3">
              Enlaces de interés
            </h3>
            <ul className="space-y-2">
              {[
                { label: 'Plan de Desarrollo Institucional', href: 'https://www.uniamazonia.edu.co/documentos/docs/Oficina%20Asesora%20de%20Planeacion/Plan%20de%20Desarrollo%20Institucional/PDI%202020%20-2029.pdf' },
                { label: 'Ofertas de Salas y Vehículos', href: 'https://www.uniamazonia.edu.co/inicio/index.php/es/2013-08-14-20-35-02.html' },
                { label: 'Política de Privacidad', href: 'https://www.uniamazonia.edu.co/inicio/index.php/politica-de-privacidad.html' },
                { label: 'Política de Derechos de Autor', href: 'https://www.uniamazonia.edu.co/documentos/docs/Consejo%20Superior/Acuerdos/2023/Acuerdo%20001%20-%20Por%20el%20cual%20se%20modifica%20de%20forma%20parcial%20el%20Estatuto%20de%20Propiedad%20Intelectual%20de%20la%20Universidad%20de%20la%20Amazonia.pdf' },
                { label: 'Términos y condiciones', href: 'https://www.uniamazonia.edu.co/documentos/docs/Departamento%20de%20Tecnologias%20de%20la%20Informacion/Guias%20para%20los%20usuarios/Terminos%20y%20condiciones%20del%20sitio%20web%202025.pdf' },
                { label: 'Mapa del sitio', href: 'https://www.uniamazonia.edu.co/Inicio/index.php/la-universidad/mapa-de-sitio.html' },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 hover:text-primary-700 underline transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold text-primary-700 uppercase tracking-widest mb-3">
              Contáctanos
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                Sede Porvenir Calle 17 Diagonal 17 con Carrera 3F - Barrio Porvenir -{' '}
                <a
                  href="https://maps.google.com/?q=Universidad+de+la+Amazonia,+Florencia,+Caquetá"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-700 underline"
                >
                  Florencia, Caquetá, Colombia, Suramérica
                </a>
              </p>
              <p>Atención Público: Lunes a Viernes de 7:30 a.m. a 11:30 m. - 1:30 p.m. a 5:30 p.m.</p>
              <p>
                Contacto:{' '}
                <a href="mailto:atencionalciudadano@uniamazonia.edu.co" className="text-primary-700 underline">
                  atencionalciudadano@uniamazonia.edu.co
                </a>
              </p>
              <p>
                PQRS-D:{' '}
                <a href="mailto:quejasyreclamos@uniamazonia.edu.co" className="text-primary-700 underline">
                  quejasyreclamos@uniamazonia.edu.co
                </a>
              </p>
              <p>
                Notificaciones judiciales:{' '}
                <a href="mailto:njudiciales@uniamazonia.edu.co" className="text-primary-700 underline">
                  njudiciales@uniamazonia.edu.co
                </a>
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-primary-700 uppercase tracking-widest mb-3">
              Localización física
            </h3>
            <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm h-44">
              <iframe
                title="Ubicación Universidad de la Amazonia"
                src="https://maps.google.com/maps?q=Universidad+de+la+Amazonia+Florencia+Caqueta+Colombia&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {[
              {
                label: 'Facebook',
                href: 'https://www.facebook.com/uniamazonia.edu.co',
                icon: <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />,
              },
              {
                label: 'Instagram',
                href: 'https://www.instagram.com/uniamazonia/',
                icon: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />,
              },
              {
                label: 'YouTube',
                href: 'https://www.youtube.com/@uamazonia',
                icon: <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />,
              },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-8 h-8 flex items-center justify-center bg-primary-700 hover:bg-primary-800 text-white rounded-full transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" stroke="none" viewBox="0 0 24 24">
                  {s.icon}
                </svg>
              </a>
            ))}
          </div>

          <a
            href="https://www.gov.co/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/Icons/gov-co.jpg"
              alt="GOV.CO"
              className="h-8 w-auto object-contain"
            />
          </a>

          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Universidad de la Amazonia. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
