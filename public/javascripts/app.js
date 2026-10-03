
(function () {
  "use strict";

  function temSwal() {
    return typeof window.Swal !== "undefined";
  }

  function confirmarExclusao(form) {
    var nome = form.getAttribute("data-confirm") || "este registro";
    if (!temSwal()) {
      if (window.confirm("Excluir " + nome + "?")) form.submit();
      return false;
    }
    window.Swal.fire({
      title: "Excluir " + nome + "?",
      text: "O registro sai do livro. Dá para cadastrar de novo depois.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Excluir",
      cancelButtonText: "Manter",
      reverseButtons: true,
      focusCancel: true,
    }).then(function (r) {
      if (r.isConfirmed) {
        try {
          window.localStorage.setItem(
            "livroFlash",
            JSON.stringify({
              titulo: "Excluído do livro",
              texto:
                nome.charAt(0).toUpperCase() + nome.slice(1) + " foi removido.",
              icone: "success",
            }),
          );
        } catch (e) {
          
        }
        form.submit();
      }
    });
    return false;
  }

  function mostrarRetorno() {
    var bruto = null;
    try {
      bruto = window.localStorage.getItem("livroFlash");
      window.localStorage.removeItem("livroFlash");
    } catch (e) {
      return;
    }
    if (!bruto || !temSwal()) return;
    if (document.querySelector(".erro")) return;
    var f = null;
    try {
      f = JSON.parse(bruto);
    } catch (e) {
      return;
    }
    if (!f || !f.titulo) return;
    window.Swal.fire({
      title: f.titulo,
      text: f.texto,
      icon: f.icone || "success",
      timer: 3200,
      showConfirmButton: false,
      toast: true,
      position: "top-end",
    });
  }

  document.addEventListener("submit", function (ev) {
    var form = ev.target;
    if (form && form.matches && form.matches("form[data-confirm]")) {
      ev.preventDefault();
      confirmarExclusao(form);
      return;
    }
    if (form && form.matches && form.matches("form[data-flash]")) {
      try {
        window.localStorage.setItem(
          "livroFlash",
          JSON.stringify({
            titulo: form.getAttribute("data-flash"),
            texto: form.getAttribute("data-flash-texto") || "",
            icone: "success",
          }),
        );
      } catch (e) {
        
      }
    }
  });

  document.addEventListener("DOMContentLoaded", mostrarRetorno);
  document.addEventListener("DOMContentLoaded", function () {
    if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
  });
})();
