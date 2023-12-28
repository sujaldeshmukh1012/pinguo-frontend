n = 10
str_output = ""

# Upper half
for i in range(int(n / 2), n, 2):
    for j in range(1, n - i, 2):
        str_output += " "
    for j in range(1, i + 2):
        str_output += "*"
    for j in range(1, n - i + 2):
        str_output += " "
    for j in range(1, i + 1):
        str_output += "*"
    str_output += "\n"

# Lower half
for i in range(n, 0, -1):
    for j in range(0, n - i):
        str_output += " "
    for j in range(1, i * 2):
        str_output += "*"
    str_output += "\n"

print(str_output)
