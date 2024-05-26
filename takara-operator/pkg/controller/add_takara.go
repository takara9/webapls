package controller

import (
	"github.com/takara-operator/pkg/controller/takara"
)

func init() {
	// AddToManagerFuncs is a list of functions to create controllers and add them to a manager.
	AddToManagerFuncs = append(AddToManagerFuncs, takara.Add)
}
