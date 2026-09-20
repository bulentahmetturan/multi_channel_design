# Pinned intermediate CA certificates (public, not secret)

Some official hosts serve an incomplete TLS chain. Browsers/OS stores complete it via AIA; Python/OpenSSL on Linux
(GitHub Actions) does not. Instead of disabling verification, the missing PUBLIC intermediate is pinned here and used
only as an extra trust path (partial chain) in the TLS fallback of `tls_verified_get`.

| File | Host(s) | Issuer chain | Source | Valid until |
|---|---|---|---|---|
| `fnmt-ac-componentes-informaticos.pem` | `*.universidades.gob.es` | issued by AC RAIZ FNMT-RCM | AIA `http://www.cert.fnmt.es/certs/ACCOMP.crt` (SHA-256 F0:38:42:1F:07:F2:0D:63:A2:0D:36:91:E5:A1:78:AB:84:59:EB:E5:70:C1:64:7B:76:90:55:4E:F2:38:76:AB) | 2028-06-24 |

Verified with `openssl verify -partial_chain` against the live leaf certificate.
