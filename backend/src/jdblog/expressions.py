import operator
import shlex
from typing import Any, Dict, List, Union

import luqum.tree
from luqum.parser import parser
from sqlalchemy.sql.elements import OperatorExpression, True_
from sqlmodel import SQLModel, and_, not_, or_, true

# Keywords.
AND = "AND"
OR = "OR"
NOT = "NOT"
EQUALS = "EQUALS"
NOT_EQUALS = "NOT_EQUALS"
MORE_THAN = ">"
LESS_THAN = "<"
MORE_THAN_OR_EQUAL = ">="
LESS_THAN_OR_EQUAL = "<="
TRUE = "TRUE"
OP = "OP"
ARGS = "ARGS"
STAR = "*"


def convert(
    expression_tree: Dict[str, Any] | List,
    object_klass: type[SQLModel],
) -> Union[OperatorExpression, True_]:
    """Convert expression tree into a sqlmodel expression.

    Arguments:
        expression_tree (Dict[str, Any]): The expression tree to convert.
        object_klass (SQLModel): The SQL model to use for the conversion.

    Returns:
        OperatorExpression: The operation expression after conversion.

    Raises:
        TypeError: Raised when an expression cannot be converted from the
            expression tree.

    """
    operation = expression_tree[OP]  # type: ignore
    args = expression_tree[ARGS]  # type: ignore

    if operation == EQUALS:
        attr, value = args[0], args[1].strip('"')
        if attr == STAR:
            return or_(  # type: ignore
                *[
                    convert(
                        {OP: EQUALS, ARGS: [objectattr, value]},
                        object_klass,
                    )
                    for objectattr in object_klass.model_fields.keys()
                ]
            )
        if value.count("*"):
            value = value.replace("*", "%")
            return getattr(object_klass, attr).like(value)
        else:
            return operator.eq(getattr(object_klass, attr), value)
    elif operation == NOT:
        return not_(convert(args[0], object_klass))  # type: ignore
    elif operation == NOT_EQUALS:
        return getattr(object_klass, args[0]) != args[1]
    elif operation == MORE_THAN:
        return getattr(object_klass, args[0]) > args[1]
    elif operation == LESS_THAN:
        return getattr(object_klass, args[0]) < args[1]
    elif operation == MORE_THAN_OR_EQUAL:
        return getattr(object_klass, args[0]) >= args[1]
    elif operation == LESS_THAN_OR_EQUAL:
        return getattr(object_klass, args[0]) <= args[1]
    elif operation == OR:
        return or_(
            *map(  # type: ignore
                lambda argument: convert(argument, object_klass),
                args,
            )
        )
    elif operation == AND:
        return and_(  # type: ignore
            *map(  # type: ignore
                lambda argument: convert(argument, object_klass),
                args,
            )
        )
    elif operation == TRUE:
        return true

    raise TypeError


def lucene_convert(lucene_str: str) -> Dict[str, Any]:
    if "AND" not in lucene_str and ":" not in lucene_str and lucene_str != "*":
        lucene_str = " ".join(
            [f'*:"*{item}*"' for item in shlex.split(lucene_str)],
        )
    lucene_tree = parser.parse(lucene_str)
    return _lucene_convert(lucene_tree)


def _lucene_convert(lucene_tree: luqum.tree.Item) -> Dict[str, Any]:

    and_or_operator = {
        "AND": AND,
        "OR": OR,
        "": AND,
    }

    if isinstance(lucene_tree, luqum.tree.Word) and lucene_tree.value == "*":
        return {OP: TRUE, ARGS: []}

    if hasattr(lucene_tree, "op") and lucene_tree.op in and_or_operator:
        operation = and_or_operator.get(lucene_tree.op)
        return {
            OP: operation,
            ARGS: list(map(_lucene_convert, lucene_tree.children)),
        }

    if isinstance(lucene_tree, (luqum.tree.Phrase, luqum.tree.Word)):
        return {
            OP: EQUALS,
            ARGS: ["*", lucene_tree.value.replace('"', "")],
        }

    if isinstance(lucene_tree, luqum.tree.SearchField) and hasattr(
        lucene_tree.expr, "value"
    ):
        return {
            OP: EQUALS,
            ARGS: [lucene_tree.name, lucene_tree.expr.value],
        }

    if isinstance(lucene_tree, luqum.tree.SearchField) and isinstance(
        lucene_tree.expr, luqum.tree.FieldGroup
    ):
        return {
            OP: EQUALS,
            ARGS: [lucene_tree.name, lucene_tree.expr.value],
        }

    if isinstance(lucene_tree, luqum.tree.Not):
        return {OP: NOT, ARGS: [_lucene_convert(lucene_tree.children[0])]}

    if isinstance(lucene_tree, luqum.tree.Group):
        return _lucene_convert(lucene_tree.children[0])

    raise TypeError
