{
  description = "Chainable Components - A library for composing React components";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            # Node.js and npm (npm is included with nodejs)
            nodejs_22

            # Build tools
            git
          ];

          shellHook = ''
            echo "🔧 Chainable Components Development Environment"
            echo "Node version: $(node --version)"
            echo "NPM version: $(npm --version)"
            echo ""
            echo "Available commands:"
            echo "  npm install        - Install dependencies"
            echo "  npm run build      - Build the project"
            echo "  npm test           - Run tests"
            echo "  npm run lint       - Run linter"
            echo "  npm publish        - Publish to npm (requires auth)"
            echo ""
          '';
        };
      }
    );
}
